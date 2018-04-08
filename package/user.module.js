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
const common_1 = require("@nestjs/common");
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const PermissionDefinition_1 = require("./decorator/PermissionDefinition");
const UserComponentProvider_1 = require("./export/UserComponentProvider");
const PermissionGuard_1 = require("./guard/PermissionGuard");
const Func_entity_1 = require("./model/Func.entity");
const InfoGroup_entity_1 = require("./model/InfoGroup.entity");
const InfoItem_entity_1 = require("./model/InfoItem.entity");
const Module_entity_1 = require("./model/Module.entity");
const Organization_entity_1 = require("./model/Organization.entity");
const Permission_entity_1 = require("./model/Permission.entity");
const Role_entity_1 = require("./model/Role.entity");
const Score_entity_1 = require("./model/Score.entity");
const ScoreType_entity_1 = require("./model/ScoreType.entity");
const User_entity_1 = require("./model/User.entity");
const UserInfo_entity_1 = require("./model/UserInfo.entity");
const FuncResolver_1 = require("./resolver/FuncResolver");
const InfoGroupResolver_1 = require("./resolver/InfoGroupResolver");
const InfoItemResolver_1 = require("./resolver/InfoItemResolver");
const ModuleResolver_1 = require("./resolver/ModuleResolver");
const OrganizationResolver_1 = require("./resolver/OrganizationResolver");
const RoleResolver_1 = require("./resolver/RoleResolver");
const ScoreResolver_1 = require("./resolver/ScoreResolver");
const ScoreTypeResolver_1 = require("./resolver/ScoreTypeResolver");
const UserResolver_1 = require("./resolver/UserResolver");
const FuncService_1 = require("./service/FuncService");
const InfoGroupService_1 = require("./service/InfoGroupService");
const InfoItemService_1 = require("./service/InfoItemService");
const ModuleService_1 = require("./service/ModuleService");
const OrganizationService_1 = require("./service/OrganizationService");
const RoleService_1 = require("./service/RoleService");
const ScoreService_1 = require("./service/ScoreService");
const ScoreTypeService_1 = require("./service/ScoreTypeService");
const UserService_1 = require("./service/UserService");
const FloatUtil_1 = require("./util/FloatUtil");
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
            let modules = yield this.moduleRepository.find({ relations: ['permissions', 'funcs', 'roles'] });
            for (let [key, value] of this.moduleMap.entries()) {
                let token = key;
                let components = [...value.components, ...value.routes];
                let permissions = new Map();
                for (let component of components) {
                    let [key, value] = component;
                    let isResolver = Reflect.getMetadata('graphql:resolver_type', value.metatype);
                    let isController = Reflect.getMetadata('path', value.metatype);
                    if (isResolver || isController) {
                        Reflect.defineMetadata(PermissionGuard_1.MODULE_TOKEN, token, value.metatype);
                        let pers = Reflect.getMetadata(PermissionDefinition_1.PERMISSION_DEFINITION, value.metatype);
                        pers && pers.forEach(per => {
                            permissions.set(per.name, per);
                        });
                        let prototype = Object.getPrototypeOf(value.instance);
                        this.metadataScanner.scanFromPrototype(value.instance, prototype, name => {
                            let pers = Reflect.getMetadata(PermissionDefinition_1.PERMISSION_DEFINITION, value.metatype, name);
                            pers && pers.forEach(per => {
                                permissions.set(per.name, per);
                            });
                            return pers;
                        });
                    }
                }
                if (permissions.values) {
                    let pers = [];
                    for (let value of permissions.values()) {
                        pers.push(value);
                    }
                    let index = modules.findIndex(module => {
                        return module.token === token;
                    });
                    if (index >= 0) {
                        let module = modules[index];
                        for (let per of pers) {
                            let find = module.permissions.find(p => {
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
                        for (let p of module.permissions) {
                            let find = pers.find(per => {
                                return per.name === p.name;
                            });
                            if (!find) {
                                yield this.permissionRepository.remove(p);
                            }
                        }
                        modules.splice(index, 1);
                    }
                    else if (pers.length > 0) {
                        let module = this.moduleRepository.create({ token, permissions: pers });
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
            let base = this.infoGroupRepository.create({ id: 1, name: 'Base', default: true, status: true });
            let nickname = this.infoItemRepository.create({
                id: 1,
                name: 'nickname',
                label: '昵称',
                default: true,
                description: '用户昵称',
                type: 'text',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 1
            });
            let sex = this.infoItemRepository.create({
                id: 2,
                name: 'sex',
                label: '性别',
                default: true,
                description: '用户性别，只能为男或女',
                type: 'radio',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 2
            });
            let age = this.infoItemRepository.create({
                id: 3,
                name: 'age',
                label: '年龄',
                default: true,
                description: '用户年龄，只能为数字',
                type: 'number',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 3
            });
            let birthday = this.infoItemRepository.create({
                id: 4,
                name: 'birthday',
                label: '生日',
                default: true,
                description: '用户生日',
                type: 'date',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 4
            });
            let headPortrait = this.infoItemRepository.create({
                id: 5,
                name: 'headPortrait',
                label: '头像',
                default: true,
                description: '用户头像，必须为上传图片，需要预览',
                type: 'uploadimagewithpreview',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 5
            });
            let sign = this.infoItemRepository.create({
                id: 6,
                name: 'sign',
                label: '签名',
                default: true,
                description: '用户签名，为多行文本',
                type: 'textarea',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 6
            });
            base.items = [nickname, sex, age, birthday, headPortrait, sign];
            yield this.infoGroupRepository.save(base);
            let authentication = this.infoGroupRepository.create({
                id: 2,
                name: 'authentication',
                default: true,
                status: true
            });
            let email = this.infoItemRepository.create({
                id: 7,
                name: 'email',
                label: '邮箱',
                default: true,
                description: '用户邮箱',
                type: 'text',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 1
            });
            let realName = this.infoItemRepository.create({
                id: 8,
                name: 'realName',
                label: '姓名',
                default: true,
                description: '用户真实姓名',
                type: 'text',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 2
            });
            let idNumber = this.infoItemRepository.create({
                id: 9,
                name: 'idNumber',
                label: '身份证号',
                default: true,
                description: '用户身份证号',
                type: 'text',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 3
            });
            let idImage = this.infoItemRepository.create({
                id: 10,
                name: 'idImage',
                label: '身份证图片',
                default: true,
                description: '用户身份证图片，正反面在同一页',
                type: 'uploadfile',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 4
            });
            let cellPhoneNumber = this.infoItemRepository.create({
                id: 11,
                name: 'cellPhoneNumber',
                label: '手机号',
                default: true,
                description: '用户手机号',
                type: 'text',
                necessary: true,
                registerVisible: true,
                informationVisible: true,
                order: 5
            });
            authentication.items = [email, realName, idNumber, idImage, cellPhoneNumber];
            yield this.infoGroupRepository.save(authentication);
        });
    }
    addDefaultScoreType() {
        return __awaiter(this, void 0, void 0, function* () {
            let scoreType1 = this.scoreTypeRepository.create({
                id: 1,
                name: '积分',
                type: 'int',
                default: true,
                description: '积分，用于......'
            });
            let scoreType2 = this.scoreTypeRepository.create({
                id: 2,
                name: '贡献',
                type: 'int',
                default: true,
                description: '贡献，用于......'
            });
            let scoreType3 = this.scoreTypeRepository.create({
                id: 3,
                name: '威望',
                type: 'int',
                default: true,
                description: '威望，用于......'
            });
            let scoreType4 = this.scoreTypeRepository.create({
                id: 4,
                name: '余额',
                type: 'float',
                default: true,
                description: '余额，用于......'
            });
            yield this.scoreTypeRepository.save([scoreType1, scoreType2, scoreType3, scoreType4]);
        });
    }
};
UserModule = __decorate([
    common_1.Global(),
    common_1.Module({
        modules: [typeorm_1.TypeOrmModule.forFeature([Module_entity_1.Module, Organization_entity_1.Organization, User_entity_1.User, ScoreType_entity_1.ScoreType, Score_entity_1.Score, InfoGroup_entity_1.InfoGroup, InfoItem_entity_1.InfoItem, UserInfo_entity_1.UserInfo, Role_entity_1.Role, Func_entity_1.Func, Permission_entity_1.Permission])],
        controllers: [],
        components: [
            FloatUtil_1.FloatUtil,
            OrganizationService_1.OrganizationService, OrganizationResolver_1.OrganizationResolver,
            ScoreTypeService_1.ScoreTypeService, ScoreTypeResolver_1.ScoreTypeResolver,
            InfoGroupService_1.InfoGroupService, InfoGroupResolver_1.InfoGroupResolver,
            InfoItemService_1.InfoItemService, InfoItemResolver_1.InfoItemResolver,
            ModuleService_1.ModuleService, ModuleResolver_1.ModuleResolver,
            ScoreService_1.ScoreService, ScoreResolver_1.ScoreResolver,
            FuncService_1.FuncService, FuncResolver_1.FuncResolver,
            UserService_1.UserService, UserResolver_1.UserResolver,
            RoleService_1.RoleService, RoleResolver_1.RoleResolver,
            UserComponentProvider_1.UserComponentProvider
        ],
        exports: [UserComponentProvider_1.UserComponentProvider]
    }),
    __param(0, common_1.Inject(modules_container_1.ModulesContainer.name)),
    __param(1, typeorm_1.InjectRepository(Role_entity_1.Role)),
    __param(2, typeorm_1.InjectRepository(Func_entity_1.Func)),
    __param(3, typeorm_1.InjectRepository(common_1.Module)),
    __param(4, typeorm_1.InjectRepository(InfoItem_entity_1.InfoItem)),
    __param(5, typeorm_1.InjectRepository(ScoreType_entity_1.ScoreType)),
    __param(6, typeorm_1.InjectRepository(InfoGroup_entity_1.InfoGroup)),
    __param(7, typeorm_1.InjectRepository(Permission_entity_1.Permission)),
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
