"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const permission_definition_1 = require("./decorator/permission.definition");
const user_component_provider_1 = require("./export/user.component.provider");
const organization_resolver_1 = require("./resolver/organization.resolver");
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./service/organization.service");
const score_type_resolver_1 = require("./resolver/score.type.resolver");
const info_group_resolver_1 = require("./resolver/info.group.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const info_item_resolver_1 = require("./resolver/info.item.resolver");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const module_entity_1 = require("./model/module.entity");
const organization_entity_1 = require("./model/organization.entity");
const permission_guard_1 = require("./guard/permission.guard");
const permission_entity_1 = require("./model/permission.entity");
const info_group_entity_1 = require("./model/info.group.entity");
const typeorm_2 = require("typeorm");
const func_entity_1 = require("./model/func.entity");
const info_item_entity_1 = require("./model/info.item.entity");
const role_entity_1 = require("./model/role.entity");
const score_entity_1 = require("./model/score.entity");
const score_type_entity_1 = require("./model/score.type.entity");
const user_entity_1 = require("./model/user.entity");
const user_info_entity_1 = require("./model/user.info.entity");
const func_resolver_1 = require("./resolver/func.resolver");
const module_resolver_1 = require("./resolver/module.resolver");
const role_resolver_1 = require("./resolver/role.resolver");
const score_resolver_1 = require("./resolver/score.resolver");
const user_resolver_1 = require("./resolver/user.resolver");
const func_service_1 = require("./service/func.service");
const info_group_service_1 = require("./service/info.group.service");
const info_item_service_1 = require("./service/info.item.service");
const module_service_1 = require("./service/module.service");
const role_service_1 = require("./service/role.service");
const score_service_1 = require("./service/score.service");
const score_type_service_1 = require("./service/score.type.service");
const user_service_1 = require("./service/user.service");
const float_util_1 = require("./util/float.util");
let UserModule = class UserModule {
    constructor(moduleMap, roleRepository, funcRepository, moduleRepository, infoItemRepository, scoreTypeRepository, infoGroupRepository, permissionRepository) {
        this.moduleMap = moduleMap;
        this.roleRepository = roleRepository;
        this.funcRepository = funcRepository;
        this.moduleRepository = moduleRepository;
        this.infoItemRepository = infoItemRepository;
        this.scoreTypeRepository = scoreTypeRepository;
        this.infoGroupRepository = infoGroupRepository;
        this.permissionRepository = permissionRepository;
        this.metadataScanner = new metadata_scanner_1.MetadataScanner();
    }
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkPermissionDefinition();
            yield this.addDefaultInfoGroup();
            yield this.addDefaultScoreType();
        });
    }
    checkPermissionDefinition() {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield this.moduleRepository.find({
                relations: [
                    "permissions",
                    "funcs",
                    "roles",
                ],
            });
            for (const [key, value] of this.moduleMap.entries()) {
                const token = key;
                const components = [...value.components, ...value.routes];
                const permissions = new Map();
                for (const component of components) {
                    const [key, value] = component;
                    const isResolver = Reflect.getMetadata("graphql:resolver_type", value.metatype);
                    const isController = Reflect.getMetadata("path", value.metatype);
                    if (isResolver || isController) {
                        Reflect.defineMetadata(permission_guard_1.MODULE_TOKEN, token, value.metatype);
                        const pers = Reflect.getMetadata(permission_definition_1.PERMISSION_DEFINITION, value.metatype);
                        pers && pers.forEach(per => {
                            permissions.set(per.name, per);
                        });
                        const prototype = Object.getPrototypeOf(value.instance);
                        this.metadataScanner.scanFromPrototype(value.instance, prototype, name => {
                            const pers = Reflect.getMetadata(permission_definition_1.PERMISSION_DEFINITION, value.metatype, name);
                            pers && pers.forEach(per => {
                                permissions.set(per.name, per);
                            });
                            return pers;
                        });
                    }
                }
                if (permissions.values) {
                    const pers = [];
                    for (const value of permissions.values()) {
                        pers.push(value);
                    }
                    const index = modules.findIndex(module => {
                        return module.token === token;
                    });
                    if (index >= 0) {
                        const module = modules[index];
                        for (const per of pers) {
                            const find = module.permissions.find(p => {
                                return p.name === per.name;
                            });
                            if (!find) {
                                per.module = module;
                                yield this.permissionRepository.save(per);
                            }
                            else {
                                find.description = per.description;
                                yield this.permissionRepository.save(find);
                            }
                        }
                        for (const p of module.permissions) {
                            const find = pers.find(per => {
                                return per.name === p.name;
                            });
                            if (!find) {
                                yield this.permissionRepository.remove(p);
                            }
                        }
                        modules.splice(index, 1);
                    }
                    else if (pers.length > 0) {
                        const module = this.moduleRepository.create({ token, permissions: pers });
                        yield this.moduleRepository.save(module);
                    }
                    else {
                    }
                }
            }
            if (modules.length > 0) {
                for (let i = 0; i < modules.length; i++) {
                    yield this.roleRepository.remove(modules[i].roles);
                    yield this.funcRepository.remove(modules[i].funcs);
                    yield this.permissionRepository.remove(modules[i].permissions);
                    yield this.moduleRepository.remove(modules[i]);
                }
            }
        });
    }
    addDefaultInfoGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            const base = this.infoGroupRepository.create({ id: 1, name: "Base", default: true, status: true });
            const nickname = this.infoItemRepository.create({
                id: 1,
                name: "nickname",
                label: "昵称",
                default: true,
                description: "用户昵称",
                type: "text",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 1,
            });
            const sex = this.infoItemRepository.create({
                id: 2,
                name: "sex",
                label: "性别",
                default: true,
                description: "用户性别，只能为男或女",
                type: "radio",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 2,
            });
            const age = this.infoItemRepository.create({
                id: 3,
                name: "age",
                label: "年龄",
                default: true,
                description: "用户年龄，只能为数字",
                type: "number",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 3,
            });
            const birthday = this.infoItemRepository.create({
                id: 4,
                name: "birthday",
                label: "生日",
                default: true,
                description: "用户生日",
                type: "date",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 4,
            });
            const headPortrait = this.infoItemRepository.create({
                id: 5,
                name: "headPortrait",
                label: "头像",
                default: true,
                description: "用户头像，必须为上传图片，需要预览",
                type: "uploadimagewithpreview",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 5,
            });
            const sign = this.infoItemRepository.create({
                id: 6,
                name: "sign",
                label: "签名",
                default: true,
                description: "用户签名，为多行文本",
                type: "textarea",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 6,
            });
            base.items = [nickname, sex, age, birthday, headPortrait, sign];
            yield this.infoGroupRepository.save(base);
            const authentication = this.infoGroupRepository.create({
                id: 2,
                name: "authentication",
                default: true,
                status: true,
            });
            const email = this.infoItemRepository.create({
                id: 7,
                name: "email",
                label: "邮箱",
                default: true,
                description: "用户邮箱",
                type: "text",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 1,
            });
            const realName = this.infoItemRepository.create({
                id: 8,
                name: "realName",
                label: "姓名",
                default: true,
                description: "用户真实姓名",
                type: "text",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 2,
            });
            const idNumber = this.infoItemRepository.create({
                id: 9,
                name: "idNumber",
                label: "身份证号",
                default: true,
                description: "用户身份证号",
                type: "text",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 3,
            });
            const idImage = this.infoItemRepository.create({
                id: 10,
                name: "idImage",
                label: "身份证图片",
                default: true,
                description: "用户身份证图片，正反面在同一页",
                type: "uploadfile",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 4,
            });
            const cellPhoneNumber = this.infoItemRepository.create({
                id: 11,
                name: "cellPhoneNumber",
                label: "手机号",
                default: true,
                description: "用户手机号",
                type: "text",
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 5,
            });
            authentication.items = [email, realName, idNumber, idImage, cellPhoneNumber];
            yield this.infoGroupRepository.save(authentication);
        });
    }
    addDefaultScoreType() {
        return __awaiter(this, void 0, void 0, function* () {
            const scoreType1 = this.scoreTypeRepository.create({
                id: 1,
                name: "积分",
                type: "int",
                default: true,
                description: "积分，用于......",
            });
            const scoreType2 = this.scoreTypeRepository.create({
                id: 2,
                name: "贡献",
                type: "int",
                default: true,
                description: "贡献，用于......",
            });
            const scoreType3 = this.scoreTypeRepository.create({
                id: 3,
                name: "威望",
                type: "int",
                default: true,
                description: "威望，用于......",
            });
            const scoreType4 = this.scoreTypeRepository.create({
                id: 4,
                name: "余额",
                type: "float",
                default: true,
                description: "余额，用于......",
            });
            yield this.scoreTypeRepository.save([scoreType1, scoreType2, scoreType3, scoreType4]);
        });
    }
};
UserModule = __decorate([
    common_1.Global(),
    common_1.Module({
        modules: [
            typeorm_1.TypeOrmModule.forFeature([
                module_entity_1.Module,
                organization_entity_1.Organization,
                user_entity_1.User,
                score_type_entity_1.ScoreType,
                score_entity_1.Score,
                info_group_entity_1.InfoGroup,
                info_item_entity_1.InfoItem,
                user_info_entity_1.UserInfo,
                role_entity_1.Role,
                func_entity_1.Func,
                permission_entity_1.Permission,
            ]),
        ],
        components: [
            float_util_1.FloatUtil,
            organization_service_1.OrganizationService,
            organization_resolver_1.OrganizationResolver,
            score_type_service_1.ScoreTypeService,
            score_type_resolver_1.ScoreTypeResolver,
            info_group_service_1.InfoGroupService,
            info_group_resolver_1.InfoGroupResolver,
            info_item_service_1.InfoItemService,
            info_item_resolver_1.InfoItemResolver,
            module_service_1.ModuleService,
            module_resolver_1.ModuleResolver,
            score_service_1.ScoreService,
            score_resolver_1.ScoreResolver,
            func_service_1.FuncService,
            func_resolver_1.FuncResolver,
            user_service_1.UserService,
            user_resolver_1.UserResolver,
            role_service_1.RoleService,
            role_resolver_1.RoleResolver,
            user_component_provider_1.UserComponentProvider,
        ],
        exports: [
            user_component_provider_1.UserComponentProvider,
            user_service_1.UserService,
        ],
    }),
    __param(0, common_1.Inject(modules_container_1.ModulesContainer.name)),
    __param(1, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(2, typeorm_1.InjectRepository(func_entity_1.Func)),
    __param(3, typeorm_1.InjectRepository(common_1.Module)),
    __param(4, typeorm_1.InjectRepository(info_item_entity_1.InfoItem)),
    __param(5, typeorm_1.InjectRepository(score_type_entity_1.ScoreType)),
    __param(6, typeorm_1.InjectRepository(info_group_entity_1.InfoGroup)),
    __param(7, typeorm_1.InjectRepository(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [modules_container_1.ModulesContainer,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserModule);
exports.UserModule = UserModule;

//# sourceMappingURL=user.module.js.map
