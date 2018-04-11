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
var graphql_1 = require("@nestjs/graphql");
var exception_interceptor_1 = require("../interceptor/exception.interceptor");
var user_service_1 = require("../service/user.service");
var UserResolver = /** @class */ (function () {
    function UserResolver(userService) {
        this.userService = userService;
    }
    /* 获取当前所有用户 */
    UserResolver.prototype.users = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getAll()];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取所有用户成功", users: users }];
                }
            });
        });
    };
    /* 获取当前所有自由用户，即不属于任何组织的用户 */
    UserResolver.prototype.freedomUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var freedomUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getFreedomUsers()];
                    case 1:
                        freedomUsers = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取所有自由用户成功", freedomUsers: freedomUsers }];
                }
            });
        });
    };
    /* 获取当前所有回收站用户，即被软删除的用户 */
    UserResolver.prototype.recycleUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var recycleUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getRecycleUsers()];
                    case 1:
                        recycleUsers = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取所有回收站用户成功", recycleUsers: recycleUsers }];
                }
            });
        });
    };
    UserResolver.prototype.userInfos = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userInfos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.userInfos(id)];
                    case 1:
                        userInfos = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取指定用户信息成功", userInfos: userInfos }];
                }
            });
        });
    };
    UserResolver.prototype.rolesInUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.roles(id)];
                    case 1:
                        roles = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取指定用户角色成功", roles: roles }];
                }
            });
        });
    };
    UserResolver.prototype.permissionsInUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, permissions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.permissions(id)];
                    case 1:
                        permissions = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取指定用户角色成功", permissions: permissions }];
                }
            });
        });
    };
    /* 后台创建用户接口，只包含通用信息项，不包含特殊信息项
       模块创建用户不使用这个接口，因为模块创建用户需要添加特殊信息项
    */
    UserResolver.prototype.createUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var organizationId, userName, password;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        organizationId = body.organizationId, userName = body.userName, password = body.password;
                        if (!userName || !password) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.createUser(organizationId, userName, password)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "创建用户成功" }];
                }
            });
        });
    };
    /* 模块创建用户接口，会传递用户基本信息，与这个模块调用的信息组的信息，不同类型信息组处理方式不同
       传递信息的方式为groups对象数组，每个对象包含了信息组id，以及信息数组，信息组id用来验证信息是否正确
    */
    UserResolver.prototype.createUserWithUserInfo = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var organizationId, userName, password, groups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        organizationId = body.organizationId, userName = body.userName, password = body.password, groups = body.groups;
                        if (!userName || !password) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.createUserWithUserInfo(req, organizationId, userName, password, groups)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "创建用户成功" }];
                }
            });
        });
    };
    UserResolver.prototype.addUserInfo = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, groups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, groups = body.groups;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.addUserInfoToUser(req, id, groups)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "创建用户成功" }];
                }
            });
        });
    };
    UserResolver.prototype.updateUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userName, password;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, userName = body.userName, password = body.password;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.updateUser(id, userName, password)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "更新用户成功" }];
                }
            });
        });
    };
    UserResolver.prototype.bannedUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.bannedUser(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "封禁用户成功" }];
                }
            });
        });
    };
    UserResolver.prototype.unBannedUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.unBannedUser(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "解封用户成功" }];
                }
            });
        });
    };
    /* 软删除指定用户，即将其加入回收站 */
    UserResolver.prototype.softDeleteUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.softDeleteUser(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "删除用户到回收站成功" }];
                }
            });
        });
    };
    /* 将指定用户从回收站还原 */
    UserResolver.prototype.restoreUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.restoreUser(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "还原用户成功" }];
                }
            });
        });
    };
    /* 将指定多个用户从回收站还原 */
    UserResolver.prototype.restoreUsers = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ids = body.ids;
                        if (!ids || ids.length === 0) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.restoreUsers(ids)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "还原多个用户成功" }];
                }
            });
        });
    };
    UserResolver.prototype.deleteUser = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.deleteUser(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "删除用户成功" }];
                }
            });
        });
    };
    UserResolver.prototype.deleteUsers = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ids = body.ids;
                        if (!ids || ids.length === 0) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.deleteUsers(ids)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "删除用户成功" }];
                }
            });
        });
    };
    /* 设置用户角色，设置的角色就是用户以后拥有的所有角色 */
    UserResolver.prototype.setRoles = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, roleIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, roleIds = body.roleIds;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.setRoles(id, roleIds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "设置用户角色成功" }];
                }
            });
        });
    };
    /* 设置用户权限，设置的权限是最终结果，也就是说按照role、adds、reduces等生成的最终结果，由后端来进行差分运算，计算adds、reduces */
    UserResolver.prototype.setUserOwnPermissions = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, permissionIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, permissionIds = body.permissionIds;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.userService.setPermissions(id, permissionIds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "设置用户权限成功" }];
                }
            });
        });
    };
    __decorate([
        graphql_1.Query("users")
    ], UserResolver.prototype, "users");
    __decorate([
        graphql_1.Query("freedomUsers")
    ], UserResolver.prototype, "freedomUsers");
    __decorate([
        graphql_1.Query("recycleUsers")
    ], UserResolver.prototype, "recycleUsers");
    __decorate([
        graphql_1.Query("userInfos")
    ], UserResolver.prototype, "userInfos");
    __decorate([
        graphql_1.Query("rolesInUser")
    ], UserResolver.prototype, "rolesInUser");
    __decorate([
        graphql_1.Query("permissionsInUser")
    ], UserResolver.prototype, "permissionsInUser");
    __decorate([
        graphql_1.Mutation("createUser")
    ], UserResolver.prototype, "createUser");
    __decorate([
        graphql_1.Mutation("createUserWithUserInfo")
    ], UserResolver.prototype, "createUserWithUserInfo");
    __decorate([
        graphql_1.Mutation("addUserInfo")
    ], UserResolver.prototype, "addUserInfo");
    __decorate([
        graphql_1.Mutation("updateUser")
    ], UserResolver.prototype, "updateUser");
    __decorate([
        graphql_1.Mutation("bannedUser")
    ], UserResolver.prototype, "bannedUser");
    __decorate([
        graphql_1.Mutation("unBannedUser")
    ], UserResolver.prototype, "unBannedUser");
    __decorate([
        graphql_1.Mutation("softDeleteUser")
    ], UserResolver.prototype, "softDeleteUser");
    __decorate([
        graphql_1.Mutation("restoreUser")
    ], UserResolver.prototype, "restoreUser");
    __decorate([
        graphql_1.Mutation("restoreUsers")
    ], UserResolver.prototype, "restoreUsers");
    __decorate([
        graphql_1.Mutation("deleteUser")
    ], UserResolver.prototype, "deleteUser");
    __decorate([
        graphql_1.Mutation("deleteUsers")
    ], UserResolver.prototype, "deleteUsers");
    __decorate([
        graphql_1.Mutation("setRoles")
    ], UserResolver.prototype, "setRoles");
    __decorate([
        graphql_1.Mutation("setUserOwnPermissions")
    ], UserResolver.prototype, "setUserOwnPermissions");
    UserResolver = __decorate([
        graphql_1.Resolver("User"),
        common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
        __param(0, common_1.Inject(user_service_1.UserService))
    ], UserResolver);
    return UserResolver;
}());
exports.UserResolver = UserResolver;
