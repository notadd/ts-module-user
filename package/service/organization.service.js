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
var organization_entity_1 = require("../model/organization.entity");
var user_entity_1 = require("../model/user.entity");
var OrganizationService = /** @class */ (function () {
    function OrganizationService(userRepository, organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }
    OrganizationService.prototype.getRoots = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.find({ parentId: null })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrganizationService.prototype.getChildren = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var o;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["children"] })];
                    case 1:
                        o = _a.sent();
                        if (!o) {
                            throw new common_1.HttpException("指定父组织id=" + id + "不存在", 402);
                        }
                        return [2 /*return*/, o.children];
                }
            });
        });
    };
    OrganizationService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrganizationService.prototype.createOrganization = function (name, parentId) {
        return __awaiter(this, void 0, void 0, function () {
            var parent, exist, organization, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(parentId !== undefined && parentId !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.organizationRepository.findOneById(parentId)];
                    case 1:
                        parent = _a.sent();
                        if (!parent) {
                            throw new common_1.HttpException("指定父组织id=" + parentId + "不存在", 402);
                        }
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.organizationRepository.findOne({ name: name })];
                    case 3:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定名称name=" + name + "组织已存在", 403);
                        }
                        organization = this.organizationRepository.create({ name: name, parent: parent });
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.organizationRepository.save(organization)];
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
    OrganizationService.prototype.updateOrganization = function (id, name, parentId) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, exist_1, parent, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "组织不存在", 404);
                        }
                        if (!(name !== exist.name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.organizationRepository.findOne({ name: name })];
                    case 2:
                        exist_1 = _a.sent();
                        if (exist_1) {
                            throw new common_1.HttpException("指定name=" + name + "组织已存在", 404);
                        }
                        _a.label = 3;
                    case 3:
                        parent = null;
                        if (!(parentId !== undefined && parentId !== null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.organizationRepository.findOneById(parentId)];
                    case 4:
                        parent = _a.sent();
                        if (!parent) {
                            throw new common_1.HttpException("指定父组织id=" + parentId + "不存在", 402);
                        }
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        //parent必须为null才有效，如果为undefined则不改动
                        //这一步与级联没有关系，不管级联如何设置
                        exist.name = name;
                        exist.parent = parent;
                        return [4 /*yield*/, this.organizationRepository.save(exist)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_2.toString(), 401);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    OrganizationService.prototype.deleteOrganization = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["children"] })];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "组织不存在", 404);
                        }
                        if (exist.children && exist.children.length > 0) {
                            throw new common_1.HttpException("指定组织存在子组织，无法删除", 404);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.organizationRepository.remove(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_3.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrganizationService.prototype.getUsersInOrganization = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var o;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["users"] })];
                    case 1:
                        o = _a.sent();
                        if (!o) {
                            throw new common_1.HttpException("指定id=" + id + "父组织不存在", 402);
                        }
                        //只获取不再回收站中的用户
                        return [2 /*return*/, o.users.filter(function (user) {
                                return !user.recycle;
                            })];
                }
            });
        });
    };
    OrganizationService.prototype.addUserToOrganization = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var o, user, exist, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["users"] })];
                    case 1:
                        o = _a.sent();
                        if (!o) {
                            throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
                        }
                        return [4 /*yield*/, this.userRepository.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + userId + "用户不存在", 402);
                        }
                        exist = o.users.find(function (user) {
                            return user.id === userId;
                        });
                        if (exist) {
                            throw new common_1.HttpException("指定用户id=" + userId + "已存在于指定组织id=" + id + "中", 402);
                        }
                        o.users.push(user);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.organizationRepository.save(o)];
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
    OrganizationService.prototype.addUsersToOrganization = function (id, userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var o, users, err_5, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["users"] })];
                    case 1:
                        o = _b.sent();
                        if (!o) {
                            throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
                        }
                        return [4 /*yield*/, this.userRepository.findByIds(userIds)
                            //验证是否所有需要的用户都被查询出来
                        ];
                    case 2:
                        users = _b.sent();
                        //验证是否所有需要的用户都被查询出来
                        userIds.forEach(function (id) {
                            var find = users.find(function (user) {
                                return user.id === id;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + id + "用户不存在", 402);
                            }
                        });
                        //验证是否有用户已存在于指定组织下
                        o.users.forEach(function (user) {
                            var match = userIds.find(function (id) {
                                return id === user.id;
                            });
                            if (match) {
                                throw new common_1.HttpException("指定用户id=" + user.id + "已存在于指定组织id=" + id + "中", 402);
                            }
                        });
                        (_a = o.users).push.apply(_a, users);
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.organizationRepository.save(o)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_5 = _b.sent();
                        throw new common_1.HttpException("数据库错误" + err_5.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OrganizationService.prototype.removeUserFromOrganization = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var o, user, index, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["users"] })];
                    case 1:
                        o = _a.sent();
                        if (!o) {
                            throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
                        }
                        return [4 /*yield*/, this.userRepository.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + userId + "用户不存在", 402);
                        }
                        index = o.users.findIndex(function (user) {
                            return user.id === userId;
                        });
                        if (index < 0) {
                            throw new common_1.HttpException("指定用户id=" + userId + "不存在于指定组织id=" + id + "中", 402);
                        }
                        o.users.splice(index, 1);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.organizationRepository.save(o)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_6 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_6.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OrganizationService.prototype.removeUsersFromOrganization = function (id, userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var o, users, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRepository.findOneById(id, { relations: ["users"] })];
                    case 1:
                        o = _a.sent();
                        if (!o) {
                            throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
                        }
                        return [4 /*yield*/, this.userRepository.findByIds(userIds)
                            //从组织的用户中循环移除指定用户，要求用户存在于数据库中，且用户必须已经存在于指定组织中
                        ];
                    case 2:
                        users = _a.sent();
                        //从组织的用户中循环移除指定用户，要求用户存在于数据库中，且用户必须已经存在于指定组织中
                        userIds.forEach(function (userId) {
                            var find = users.find(function (user) {
                                return user.id === userId;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 402);
                            }
                            var index = o.users.findIndex(function (user) {
                                return user.id === userId;
                            });
                            if (index < 0) {
                                throw new common_1.HttpException("指定用户id=" + userId + "不存在于指定组织id=" + id + "中", 402);
                            }
                            o.users.splice(index, 1);
                        });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.organizationRepository.save(o)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_7 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_7.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OrganizationService = __decorate([
        common_1.Component(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(1, typeorm_1.InjectRepository(organization_entity_1.Organization))
    ], OrganizationService);
    return OrganizationService;
}());
exports.OrganizationService = OrganizationService;
