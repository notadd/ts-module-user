"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var modules_container_1 = require("@nestjs/core/injector/modules-container");
var metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
var typeorm_1 = require("@nestjs/typeorm");
var permission_definition_1 = require("./decorator/permission.definition");
var user_component_provider_1 = require("./export/user.component.provider");
var permission_guard_1 = require("./guard/permission.guard");
var func_entity_1 = require("./model/func.entity");
var info_group_entity_1 = require("./model/info.group.entity");
var info_item_entity_1 = require("./model/info.item.entity");
var module_entity_1 = require("./model/module.entity");
var organization_entity_1 = require("./model/organization.entity");
var permission_entity_1 = require("./model/permission.entity");
var role_entity_1 = require("./model/role.entity");
var score_entity_1 = require("./model/score.entity");
var score_type_entity_1 = require("./model/score.type.entity");
var user_entity_1 = require("./model/user.entity");
var user_info_entity_1 = require("./model/user.info.entity");
var func_resolver_1 = require("./resolver/func.resolver");
var info_group_resolver_1 = require("./resolver/info.group.resolver");
var info_item_resolver_1 = require("./resolver/info.item.resolver");
var module_resolver_1 = require("./resolver/module.resolver");
var organization_resolver_1 = require("./resolver/organization.resolver");
var role_resolver_1 = require("./resolver/role.resolver");
var score_resolver_1 = require("./resolver/score.resolver");
var score_type_resolver_1 = require("./resolver/score.type.resolver");
var user_resolver_1 = require("./resolver/user.resolver");
var func_service_1 = require("./service/func.service");
var info_group_service_1 = require("./service/info.group.service");
var info_item_service_1 = require("./service/info.item.service");
var module_service_1 = require("./service/module.service");
var organization_service_1 = require("./service/organization.service");
var role_service_1 = require("./service/role.service");
var score_service_1 = require("./service/score.service");
var score_type_service_1 = require("./service/score.type.service");
var user_service_1 = require("./service/user.service");
var float_util_1 = require("./util/float.util");
var UserModule = /** @class */ (function () {
    function UserModule(moduleMap, roleRepository, funcRepository, moduleRepository, infoItemRepository, scoreTypeRepository, infoGroupRepository, permissionRepository) {
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
    UserModule.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //遍历模块，检查权限定义
                    return [4 /*yield*/, this.checkPermissionDefinition()
                        //确保默认信息组的存在
                    ];
                    case 1:
                        //遍历模块，检查权限定义
                        _a.sent();
                        //确保默认信息组的存在
                        return [4 /*yield*/, this.addDefaultInfoGroup()
                            //确保默认积分类型的存在
                        ];
                    case 2:
                        //确保默认信息组的存在
                        _a.sent();
                        //确保默认积分类型的存在
                        return [4 /*yield*/, this.addDefaultScoreType()];
                    case 3:
                        //确保默认积分类型的存在
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* 在初始化钩子中遍历所有模块
       获取定义在Controller与Resolver上的权限定义
       权限定义可以定义在类上或者原型方法上，与UseGuard的使用方法相同
       一个位置可以定义多个权限，作为数组存储在元数据userpm:permission_definition中
       一个模块中定义的重复权限，会被覆盖，不会报错
       新增模块直接保存，既有模块对原有权限与本次扫描出权限进行差分，相同名称权限id不变，保证既有权限与功能关联不变
       如果原有模块没有在这次遍历中被发现权限，则模块连带权限、功能、角色一起删除
     */
    UserModule.prototype.checkPermissionDefinition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules, _loop_1, this_1, _i, _a, _b, key, value, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.moduleRepository.find({ relations: ["permissions", "funcs", "roles"] })
                        //遍历模块token、Module实例
                    ];
                    case 1:
                        modules = _c.sent();
                        _loop_1 = function (key, value) {
                            var token, components, permissions, _loop_2, _i, components_1, component, pers, _a, _b, value_1, index, module_1, _loop_3, _c, pers_1, per, _loop_4, _d, _e, p, module_2;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        token = key;
                                        components = value.components.concat(value.routes);
                                        permissions = new Map();
                                        _loop_2 = function (component) {
                                            //名称、实例包装器
                                            var key_1 = component[0], value_2 = component[1];
                                            //只有resolver、controller才会被遍历，其他组件上定义权限无效
                                            var isResolver = Reflect.getMetadata("graphql:resolver_type", value_2.metatype);
                                            var isController = Reflect.getMetadata("path", value_2.metatype);
                                            if (isResolver || isController) {
                                                //在需要进行权限判断的组件类上定义模块token，用来在guard中判断权限属于哪个模块
                                                Reflect.defineMetadata(permission_guard_1.MODULE_TOKEN, token, value_2.metatype);
                                                //获取组件、控制器类上定义的权限数组
                                                var pers = Reflect.getMetadata(permission_definition_1.PERMISSION_DEFINITION, value_2.metatype);
                                                //这里在同一个模块中重复定义的权限会被覆盖
                                                //保证了name不重复
                                                pers && pers.forEach(function (per) {
                                                    permissions.set(per.name, per);
                                                });
                                                //遍历实例原型方法，获取方法上定义的权限
                                                var prototype = Object.getPrototypeOf(value_2.instance);
                                                this_1.metadataScanner.scanFromPrototype(value_2.instance, prototype, function (name) {
                                                    //获取到方法名，获取方法上定义的权限
                                                    var pers = Reflect.getMetadata(permission_definition_1.PERMISSION_DEFINITION, value_2.metatype, name);
                                                    pers && pers.forEach(function (per) {
                                                        permissions.set(per.name, per);
                                                    });
                                                    return pers;
                                                });
                                            }
                                        };
                                        //遍历组件、路由
                                        for (_i = 0, components_1 = components; _i < components_1.length; _i++) {
                                            component = components_1[_i];
                                            _loop_2(component);
                                        }
                                        if (!permissions.values) return [3 /*break*/, 11];
                                        pers = [];
                                        for (_a = 0, _b = permissions.values(); _a < _b.length; _a++) {
                                            value_1 = _b[_a];
                                            pers.push(value_1);
                                        }
                                        index = modules.findIndex(function (module) {
                                            return module.token === token;
                                        });
                                        if (!(index >= 0)) return [3 /*break*/, 9];
                                        module_1 = modules[index];
                                        _loop_3 = function (per) {
                                            var find;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        find = module_1.permissions.find(function (p) {
                                                            return p.name === per.name;
                                                        });
                                                        if (!!find) return [3 /*break*/, 2];
                                                        //说明为新增权限，保存它
                                                        per.module = module_1;
                                                        return [4 /*yield*/, this_1.permissionRepository.save(per)];
                                                    case 1:
                                                        _a.sent();
                                                        return [3 /*break*/, 4];
                                                    case 2:
                                                        find.description = per.description;
                                                        return [4 /*yield*/, this_1.permissionRepository.save(find)];
                                                    case 3:
                                                        _a.sent();
                                                        _a.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _c = 0, pers_1 = pers;
                                        _f.label = 1;
                                    case 1:
                                        if (!(_c < pers_1.length)) return [3 /*break*/, 4];
                                        per = pers_1[_c];
                                        return [5 /*yield**/, _loop_3(per)];
                                    case 2:
                                        _f.sent();
                                        _f.label = 3;
                                    case 3:
                                        _c++;
                                        return [3 /*break*/, 1];
                                    case 4:
                                        _loop_4 = function (p) {
                                            var find;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        find = pers.find(function (per) {
                                                            return per.name === p.name;
                                                        });
                                                        if (!!find) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, this_1.permissionRepository.remove(p)];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _d = 0, _e = module_1.permissions;
                                        _f.label = 5;
                                    case 5:
                                        if (!(_d < _e.length)) return [3 /*break*/, 8];
                                        p = _e[_d];
                                        return [5 /*yield**/, _loop_4(p)];
                                    case 6:
                                        _f.sent();
                                        _f.label = 7;
                                    case 7:
                                        _d++;
                                        return [3 /*break*/, 5];
                                    case 8:
                                        //将已经扫描到的模块从既有模块数组中移除
                                        modules.splice(index, 1);
                                        return [3 /*break*/, 11];
                                    case 9:
                                        if (!(pers.length > 0)) return [3 /*break*/, 11];
                                        module_2 = this_1.moduleRepository.create({ token: token, permissions: pers });
                                        return [4 /*yield*/, this_1.moduleRepository.save(module_2)];
                                    case 10:
                                        _f.sent();
                                        return [3 /*break*/, 11];
                                    case 11: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this.moduleMap.entries();
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        _b = _a[_i], key = _b[0], value = _b[1];
                        return [5 /*yield**/, _loop_1(key, value)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!(modules.length > 0)) return [3 /*break*/, 12];
                        i = 0;
                        _c.label = 6;
                    case 6:
                        if (!(i < modules.length)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.roleRepository.remove(modules[i].roles)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.funcRepository.remove(modules[i].funcs)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, this.permissionRepository.remove(modules[i].permissions)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, this.moduleRepository.remove(modules[i])];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11:
                        i++;
                        return [3 /*break*/, 6];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /* 添加默认信息组，包含基本信息组、认证信息组
      虽然信息组、信息项的id为自动生成，但是如果save方法保存的对象指定了id，在保存时会使用指定的id，如果指定id已存在，则会更新
    */
    UserModule.prototype.addDefaultInfoGroup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var base, nickname, sex, age, birthday, headPortrait, sign, authentication, email, realName, idNumber, idImage, cellPhoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base = this.infoGroupRepository.create({ id: 1, name: "Base", "default": true, status: true });
                        nickname = this.infoItemRepository.create({
                            id: 1,
                            name: "nickname",
                            label: "昵称",
                            "default": true,
                            description: "用户昵称",
                            type: "text",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 1
                        });
                        sex = this.infoItemRepository.create({
                            id: 2,
                            name: "sex",
                            label: "性别",
                            "default": true,
                            description: "用户性别，只能为男或女",
                            type: "radio",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 2
                        });
                        age = this.infoItemRepository.create({
                            id: 3,
                            name: "age",
                            label: "年龄",
                            "default": true,
                            description: "用户年龄，只能为数字",
                            type: "number",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 3
                        });
                        birthday = this.infoItemRepository.create({
                            id: 4,
                            name: "birthday",
                            label: "生日",
                            "default": true,
                            description: "用户生日",
                            type: "date",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 4
                        });
                        headPortrait = this.infoItemRepository.create({
                            id: 5,
                            name: "headPortrait",
                            label: "头像",
                            "default": true,
                            description: "用户头像，必须为上传图片，需要预览",
                            type: "uploadimagewithpreview",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 5
                        });
                        sign = this.infoItemRepository.create({
                            id: 6,
                            name: "sign",
                            label: "签名",
                            "default": true,
                            description: "用户签名，为多行文本",
                            type: "textarea",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 6
                        });
                        base.items = [nickname, sex, age, birthday, headPortrait, sign];
                        return [4 /*yield*/, this.infoGroupRepository.save(base)];
                    case 1:
                        _a.sent();
                        authentication = this.infoGroupRepository.create({
                            id: 2,
                            name: "authentication",
                            "default": true,
                            status: true
                        });
                        email = this.infoItemRepository.create({
                            id: 7,
                            name: "email",
                            label: "邮箱",
                            "default": true,
                            description: "用户邮箱",
                            type: "text",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 1
                        });
                        realName = this.infoItemRepository.create({
                            id: 8,
                            name: "realName",
                            label: "姓名",
                            "default": true,
                            description: "用户真实姓名",
                            type: "text",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 2
                        });
                        idNumber = this.infoItemRepository.create({
                            id: 9,
                            name: "idNumber",
                            label: "身份证号",
                            "default": true,
                            description: "用户身份证号",
                            type: "text",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 3
                        });
                        idImage = this.infoItemRepository.create({
                            id: 10,
                            name: "idImage",
                            label: "身份证图片",
                            "default": true,
                            description: "用户身份证图片，正反面在同一页",
                            type: "uploadfile",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 4
                        });
                        cellPhoneNumber = this.infoItemRepository.create({
                            id: 11,
                            name: "cellPhoneNumber",
                            label: "手机号",
                            "default": true,
                            description: "用户手机号",
                            type: "text",
                            necessary: true,
                            registerVisible: true,
                            informationVisible: true,
                            order: 5
                        });
                        authentication.items = [email, realName, idNumber, idImage, cellPhoneNumber];
                        return [4 /*yield*/, this.infoGroupRepository.save(authentication)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* 添加默认积分类型 */
    UserModule.prototype.addDefaultScoreType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var scoreType1, scoreType2, scoreType3, scoreType4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scoreType1 = this.scoreTypeRepository.create({
                            id: 1,
                            name: "积分",
                            type: "int",
                            "default": true,
                            description: "积分，用于......"
                        });
                        scoreType2 = this.scoreTypeRepository.create({
                            id: 2,
                            name: "贡献",
                            type: "int",
                            "default": true,
                            description: "贡献，用于......"
                        });
                        scoreType3 = this.scoreTypeRepository.create({
                            id: 3,
                            name: "威望",
                            type: "int",
                            "default": true,
                            description: "威望，用于......"
                        });
                        scoreType4 = this.scoreTypeRepository.create({
                            id: 4,
                            name: "余额",
                            type: "float",
                            "default": true,
                            description: "余额，用于......"
                        });
                        return [4 /*yield*/, this.scoreTypeRepository.save([scoreType1, scoreType2, scoreType3, scoreType4])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserModule = __decorate([
        common_1.Global(),
        common_1.Module({
            modules: [typeorm_1.TypeOrmModule.forFeature([module_entity_1.Module, organization_entity_1.Organization, user_entity_1.User, score_type_entity_1.ScoreType, score_entity_1.Score, info_group_entity_1.InfoGroup, info_item_entity_1.InfoItem, user_info_entity_1.UserInfo, role_entity_1.Role, func_entity_1.Func, permission_entity_1.Permission])],
            controllers: [],
            components: [
                float_util_1.FloatUtil,
                organization_service_1.OrganizationService, organization_resolver_1.OrganizationResolver,
                score_type_service_1.ScoreTypeService, score_type_resolver_1.ScoreTypeResolver,
                info_group_service_1.InfoGroupService, info_group_resolver_1.InfoGroupResolver,
                info_item_service_1.InfoItemService, info_item_resolver_1.InfoItemResolver,
                module_service_1.ModuleService, module_resolver_1.ModuleResolver,
                score_service_1.ScoreService, score_resolver_1.ScoreResolver,
                func_service_1.FuncService, func_resolver_1.FuncResolver,
                user_service_1.UserService, user_resolver_1.UserResolver,
                role_service_1.RoleService, role_resolver_1.RoleResolver,
                user_component_provider_1.UserComponentProvider
            ],
            exports: [user_component_provider_1.UserComponentProvider]
        }),
        __param(0, common_1.Inject(modules_container_1.ModulesContainer.name)),
        __param(1, typeorm_1.InjectRepository(role_entity_1.Role)),
        __param(2, typeorm_1.InjectRepository(func_entity_1.Func)),
        __param(3, typeorm_1.InjectRepository(common_1.Module)),
        __param(4, typeorm_1.InjectRepository(info_item_entity_1.InfoItem)),
        __param(5, typeorm_1.InjectRepository(score_type_entity_1.ScoreType)),
        __param(6, typeorm_1.InjectRepository(info_group_entity_1.InfoGroup)),
        __param(7, typeorm_1.InjectRepository(permission_entity_1.Permission))
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
