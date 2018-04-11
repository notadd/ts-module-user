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
var typeorm_1 = require("@nestjs/typeorm");
var crypto = require("crypto");
var func_entity_1 = require("../model/func.entity");
var info_group_entity_1 = require("../model/info.group.entity");
var organization_entity_1 = require("../model/organization.entity");
var permission_entity_1 = require("../model/permission.entity");
var role_entity_1 = require("../model/role.entity");
var user_entity_1 = require("../model/user.entity");
var user_info_entity_1 = require("../model/user.info.entity");
var UserService = /** @class */ (function () {
    function UserService(storeComponent, funcRepository, roleRepository, userRepository, userInfoRepository, infoGroupRepository, permissionRepository, organizationRepository) {
        this.storeComponent = storeComponent;
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.infoGroupRepository = infoGroupRepository;
        this.permissionRepository = permissionRepository;
        this.organizationRepository = organizationRepository;
    }
    UserService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.find({ recycle: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.getFreedomUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.find({ relations: ["organizations"] })];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users.filter(function (user) {
                                return (user.organizations === null || user.organizations === undefined || user.organizations.length === 0) && !user.recycle;
                            })];
                }
            });
        });
    };
    UserService.prototype.getRecycleUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.find({ recycle: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*返回用户信息时，需要提取其InfoItem对象以获取信息名称 */
    UserService.prototype.userInfos = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, userInfos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["userInfos"] })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定用户不存在", 406);
                        }
                        return [4 /*yield*/, this.userInfoRepository.createQueryBuilder("userInfo").leftJoinAndSelect("userInfo.infoItem", "infoItem", "userInfo.infoItemId=infoItem.id").where("userInfo.userId = :id", { id: id }).getMany()];
                    case 2:
                        userInfos = _a.sent();
                        return [2 /*return*/, userInfos.map(function (userInfo) {
                                return { name: userInfo.infoItem.name, value: userInfo.value };
                            })];
                }
            });
        });
    };
    UserService.prototype.roles = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["roles"] })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定用户不存在", 406);
                        }
                        return [2 /*return*/, user.roles];
                }
            });
        });
    };
    UserService.prototype.permissions = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, result, temp, ids, i, role, j, func;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["roles", "adds", "reduces"] })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        result = [];
                        temp = [];
                        ids = new Set();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < user.roles.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.roleRepository.findOneById(user.roles[i].id, { relations: ["funcs"] })];
                    case 3:
                        role = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < role.funcs.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.funcRepository.findOneById(role.funcs[i].id, { relations: ["permissions"] })];
                    case 5:
                        func = _a.sent();
                        temp = temp.concat(func.permissions);
                        _a.label = 6;
                    case 6:
                        j++;
                        return [3 /*break*/, 4];
                    case 7:
                        i++;
                        return [3 /*break*/, 2];
                    case 8:
                        //生成去重的集合
                        temp.forEach(function (per) {
                            if (!ids.has(per.id)) {
                                ids.add(per.id);
                                result.push(per);
                            }
                        });
                        //遍历添加权限
                        user.adds.forEach(function (per) {
                            if (!ids.has(per.id)) {
                                ids.add(per.id);
                                result.push(per);
                            }
                        });
                        //遍历减去权限
                        user.reduces.forEach(function (per) {
                            if (ids.has(per.id)) {
                                ids["delete"](per.id);
                                var index = result.findIndex(function (p) {
                                    return p.id === per.id;
                                });
                                result.splice(index, 1);
                            }
                        });
                        result.sort(function (a, b) {
                            return a.id - b.id;
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    UserService.prototype.createUser = function (organizationId, userName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var organizations, organization, exist, salt, passwordWithSalt, user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        organizations = [];
                        if (!organizationId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.organizationRepository.findOneById(organizationId)];
                    case 1:
                        organization = _a.sent();
                        if (!organization) {
                            throw new common_1.HttpException("指定id=" + organizationId + "组织不存在", 402);
                        }
                        organizations.push(organization);
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.userRepository.findOne({ userName: userName })];
                    case 3:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定userName=" + userName + "用户已存在", 406);
                        }
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        salt = crypto.createHash("md5").update(new Date().toString()).digest("hex").slice(0, 10);
                        passwordWithSalt = crypto.createHash("md5").update(password + salt).digest("hex");
                        user = this.userRepository.create({
                            userName: userName,
                            password: passwordWithSalt,
                            salt: salt,
                            status: true,
                            recycle: false,
                            organizations: organizations
                        });
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_1.toString(), 401);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.createUserWithUserInfo = function (req, organizationId, userName, password, groups) {
        return __awaiter(this, void 0, void 0, function () {
            var organizations, organization, exist, salt, passwordWithSalt, user, i, _a, groupId, infos, group, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        organizations = [];
                        if (!organizationId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.organizationRepository.findOneById(organizationId)];
                    case 1:
                        organization = _b.sent();
                        if (!organization) {
                            throw new common_1.HttpException("指定id=" + organizationId + "组织不存在", 402);
                        }
                        organizations.push(organization);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.userRepository.findOne({ userName: userName })];
                    case 3:
                        exist = _b.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定userName=" + userName + "用户已存在", 406);
                        }
                        salt = crypto.createHash("md5").update(new Date().toString()).digest("hex").slice(0, 10);
                        passwordWithSalt = crypto.createHash("md5").update(password + salt).digest("hex");
                        user = this.userRepository.create({
                            userName: userName,
                            password: passwordWithSalt,
                            salt: salt,
                            status: true,
                            recycle: false,
                            organizations: organizations,
                            userInfos: [],
                            infoItems: []
                        });
                        i = 0;
                        _b.label = 4;
                    case 4:
                        if (!(i < groups.length)) return [3 /*break*/, 8];
                        _a = groups[i], groupId = _a.groupId, infos = _a.infos;
                        return [4 /*yield*/, this.infoGroupRepository.findOneById(groupId, { relations: ["items"] })];
                    case 5:
                        group = _b.sent();
                        if (!group) {
                            throw new common_1.HttpException("指定信息组id=" + groupId + "不存在", 408);
                        }
                        return [4 /*yield*/, this.addUserInfosAndInfoItems(req, user, group, infos)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 4];
                    case 8:
                        _b.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _b.sent();
                        throw new common_1.HttpException("数据库错误" + err_2.toString(), 401);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.addUserInfoToUser = function (req, id, groups) {
        return __awaiter(this, void 0, void 0, function () {
            var user, i, _a, groupId, infos, group, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["userInfos", "infoItems"] })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < groups.length)) return [3 /*break*/, 6];
                        _a = groups[i], groupId = _a.groupId, infos = _a.infos;
                        return [4 /*yield*/, this.infoGroupRepository.findOneById(groupId, { relations: ["items"] })];
                    case 3:
                        group = _b.sent();
                        if (!group) {
                            throw new common_1.HttpException("指定信息组id=" + groupId + "不存在", 408);
                        }
                        return [4 /*yield*/, this.addUserInfosAndInfoItems(req, user, group, infos)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_3 = _b.sent();
                        throw new common_1.HttpException("数据库错误" + err_3.toString(), 401);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /* 将指定信息组的信息加入到用户对象中，里面没有数据库更改操作，只是改变了用户的userInfos、infoItems两个属性，当save时新的userInfo会被插入，旧的会被更新，infoItem与user的关系会被建立*/
    UserService.prototype.addUserInfosAndInfoItems = function (req, user, group, infos) {
        return __awaiter(this, void 0, void 0, function () {
            var items, necessary, _loop_1, this_1, j, names;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = group.items || [];
                        necessary = items.filter(function (item) {
                            return !!item.necessary;
                        });
                        _loop_1 = function (j) {
                            var name_1, match, result, userInfoIndex, index;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        name_1 = infos[j].name;
                                        match = items.find(function (item) {
                                            return item.name === name_1;
                                        });
                                        //如果接收到的信息项名称不存在，抛出异常
                                        if (!match) {
                                            throw new common_1.HttpException("指定名称信息项:" + name_1 + "不存在于信息组id=" + group.id + "中", 409);
                                        }
                                        return [4 /*yield*/, this_1.transfromInfoValue(req, match, infos[j])
                                            /*如果此时user中已经包含同名信息项，后来的覆盖先前的，因为相同信息项可能存在于多个组当中，而添加时可能出现一次添加多个组信息的情况，所以可能出现同类信息项 */
                                        ];
                                    case 1:
                                        result = _a.sent();
                                        userInfoIndex = user.userInfos.findIndex(function (userInfo) { return userInfo.infoItemId === match.id; });
                                        if (userInfoIndex >= 0) {
                                            /*如果当前遍历的信息项对应的信息已经存在于用户的信息当中，直接修改其value
                                              当创建用户时，出现重复，修改value后就会只保存新的用户信息
                                              当添加用户信息时，出现重复，就会修改以前的信息，并且cascaedUpdate*/
                                            user.userInfos[userInfoIndex].value = result;
                                        }
                                        else {
                                            /*不存在添加新的 */
                                            user.userInfos.push(this_1.userInfoRepository.create({ infoItem: match, value: result }));
                                        }
                                        index = necessary.findIndex(function (item) {
                                            return item.id === match.id;
                                        });
                                        if (index >= 0) {
                                            /*移除填写过的必填信息项 */
                                            necessary.splice(index, 1);
                                        }
                                        /*将添加后的信息项加入用户，如果重复保存时会字段去重 */
                                        user.infoItems.push(match);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        j = 0;
                        _a.label = 1;
                    case 1:
                        if (!(j < infos.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(j)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        j++;
                        return [3 /*break*/, 1];
                    case 4:
                        //如果必填项没有填写，抛出异常
                        if (necessary.length !== 0) {
                            names = necessary.map(function (item) { return item.name; });
                            throw new common_1.HttpException("指定信息项:" + names.join(",") + "为必填项", 410);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.transfromInfoValue = function (req, match, info) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, bucketName, name_2, type;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(match.type === "text" || match.type === "textarea" || match.type === "radio" || match.type === "date" || match.type === "number" || match.type === "pulldownmenu")) return [3 /*break*/, 1];
                        if (!info.value) {
                            throw new common_1.HttpException("指定名称信息值:" + match.name + "不存在", 410);
                        }
                        if (!(typeof info.value === "string")) {
                            throw new common_1.HttpException("指定名称信息项name=" + match.name + "必须为字符串", 410);
                        }
                        //普字符串类型值只需要删除前后空白
                        result = info.value.trim();
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(match.type === "checkbox")) return [3 /*break*/, 2];
                        if (!info.array || info.array.length === 0) {
                            throw new common_1.HttpException("指定名称信息值:" + match.name + "不存在", 410);
                        }
                        if (!(info.array instanceof Array)) {
                            throw new common_1.HttpException("指定名称信息项name=" + match.name + "必须为数组", 410);
                        }
                        //数组类型以，连接各个元素为字符串
                        result = info.array.join(",");
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(match.type === "uploadimagewithpreview" || match.type === "uploadfile")) return [3 /*break*/, 5];
                        if (!info.base64) {
                            throw new common_1.HttpException("指定名称信息项name=" + match.name + "必须具有文件base64编码", 410);
                        }
                        if (!info.rawName) {
                            throw new common_1.HttpException("指定名称信息项name=" + match.name + "必须具有文件原名", 410);
                        }
                        if (!info.bucketName) {
                            throw new common_1.HttpException("指定名称信息项name=" + match.name + "必须具有文件存储空间名", 410);
                        }
                        return [4 /*yield*/, this.storeComponent.upload(info.bucketName, info.rawName, info.base64, null)];
                    case 3:
                        _a = _b.sent(), bucketName = _a.bucketName, name_2 = _a.name, type = _a.type;
                        return [4 /*yield*/, this.storeComponent.getUrl(req, bucketName, name_2, type, null)];
                    case 4:
                        result = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, result];
                }
            });
        });
    };
    UserService.prototype.updateUser = function (id, userName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, sameUser, salt, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        if (!(userName !== exist.userName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userRepository.findOne({ userName: userName })];
                    case 2:
                        sameUser = _a.sent();
                        if (sameUser) {
                            throw new common_1.HttpException("指定userName=" + userName + "用户已存在", 406);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        exist.userName = userName;
                        salt = crypto.createHash("md5").update(new Date().toString()).digest("hex").slice(0, 10);
                        exist.salt = salt;
                        exist.password = crypto.createHash("md5").update(password + salt).digest("hex");
                        return [4 /*yield*/, this.userRepository.save(exist)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_4 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_4.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.bannedUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        if (exist.recycle) {
                            throw new common_1.HttpException("指定id=" + id + "用户已存在回收站中", 406);
                        }
                        if (!exist.status) {
                            throw new common_1.HttpException("指定id=" + id + "用户已经封禁", 406);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        exist.status = false;
                        return [4 /*yield*/, this.userRepository.save(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_5 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_5.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.unBannedUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        if (exist.recycle) {
                            throw new common_1.HttpException("指定id=" + id + "用户已存在回收站中", 406);
                        }
                        if (exist.status) {
                            throw new common_1.HttpException("指定id=" + id + "用户不需要解封", 406);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        exist.status = true;
                        return [4 /*yield*/, this.userRepository.save(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_6 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_6.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.softDeleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        if (exist.recycle) {
                            throw new common_1.HttpException("指定id=" + id + "用户已存在回收站中", 406);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        exist.recycle = true;
                        return [4 /*yield*/, this.userRepository.save(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_7 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_7.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.restoreUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        if (!exist.recycle) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在回收站中", 406);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        exist.recycle = false;
                        return [4 /*yield*/, this.userRepository.save(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_8 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_8.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.restoreUsers = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var users, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findByIds(ids)];
                    case 1:
                        users = _a.sent();
                        ids.forEach(function (id) {
                            var find = users.find(function (user) {
                                return user.id === id;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                            }
                            if (!find.recycle) {
                                throw new common_1.HttpException("指定用户id=" + id + "不在回收站中", 406);
                            }
                            find.recycle === true;
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, Promise.all(users.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.userRepository.save(user)];
                                });
                            }); }, this))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_9 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_9.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        if (!exist.recycle) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在回收站中", 406);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.userRepository.remove(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_10 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_10.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteUsers = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var users, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findByIds(ids)];
                    case 1:
                        users = _a.sent();
                        ids.forEach(function (id) {
                            var find = users.find(function (user) {
                                return user.id === id;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                            }
                            if (!find.recycle) {
                                throw new common_1.HttpException("指定id=" + id + "用户不存在于回收站中", 406);
                            }
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.userRepository.remove(users)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_11 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_11.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.setRoles = function (id, roleIds) {
        return __awaiter(this, void 0, void 0, function () {
            var user, roles, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["roles"] })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        return [4 /*yield*/, this.roleRepository.findByIds(roleIds)];
                    case 2:
                        roles = _a.sent();
                        roleIds.forEach(function (roleId) {
                            var find = roles.find(function (role) {
                                return role.id === roleId;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + roleId + "角色不存在", 406);
                            }
                        });
                        user.roles = roles;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_12 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_12.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.setPermissions = function (id, permissionIds) {
        return __awaiter(this, void 0, void 0, function () {
            var user, result, temp, ids, i, role, j, func, adds, reduces, permissions, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["roles", "adds", "reduces"] })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + id + "用户不存在", 406);
                        }
                        result = [];
                        temp = [];
                        ids = new Set();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < user.roles.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.roleRepository.findOneById(user.roles[i].id, { relations: ["funcs"] })];
                    case 3:
                        role = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < role.funcs.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.funcRepository.findOneById(role.funcs[i].id, { relations: ["permissions"] })];
                    case 5:
                        func = _a.sent();
                        temp = temp.concat(func.permissions);
                        _a.label = 6;
                    case 6:
                        j++;
                        return [3 /*break*/, 4];
                    case 7:
                        i++;
                        return [3 /*break*/, 2];
                    case 8:
                        //生成去重的集合
                        temp.forEach(function (per) {
                            if (!ids.has(per.id)) {
                                ids.add(per.id);
                                result.push(per);
                            }
                        });
                        //对参数进行去重
                        permissionIds = [].concat.apply([], new Set(permissionIds));
                        adds = [];
                        reduces = [];
                        return [4 /*yield*/, this.permissionRepository.findByIds(permissionIds)
                            //遍历获取添加的权限
                        ];
                    case 9:
                        permissions = _a.sent();
                        //遍历获取添加的权限
                        permissions.forEach(function (per) {
                            var find = result.find(function (p) {
                                return p.id === per.id;
                            });
                            //如果参数设置的权限在角色拥有权限中未找到，则为添加的权限
                            if (!find) {
                                adds.push(per);
                            }
                        });
                        //遍历获取减少的权限
                        result.forEach(function (per) {
                            var find = permissions.find(function (p) {
                                return p.id === per.id;
                            });
                            //如果角色拥有权限在参数指定的结果中未找到，那么说吗这个权限被减去了
                            if (!find) {
                                reduces.push(per);
                            }
                        });
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 13]);
                        user.adds = adds;
                        user.reduces = reduces;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        err_13 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_13.toString(), 401);
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UserService = __decorate([
        common_1.Component(),
        __param(0, common_1.Inject("StoreComponentToken")),
        __param(1, typeorm_1.InjectRepository(func_entity_1.Func)),
        __param(2, typeorm_1.InjectRepository(role_entity_1.Role)),
        __param(3, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(4, typeorm_1.InjectRepository(user_info_entity_1.UserInfo)),
        __param(5, typeorm_1.InjectRepository(info_group_entity_1.InfoGroup)),
        __param(6, typeorm_1.InjectRepository(permission_entity_1.Permission)),
        __param(7, typeorm_1.InjectRepository(organization_entity_1.Organization))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
