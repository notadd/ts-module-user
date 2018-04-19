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
const graphql_1 = require("@nestjs/graphql");
const http_1 = require("http");
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const user_service_1 = require("../service/user.service");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    users() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userService.getAll();
            return { code: 200, message: "获取所有用户成功", users };
        });
    }
    freedomUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const freedomUsers = yield this.userService.getFreedomUsers();
            return { code: 200, message: "获取所有自由用户成功", freedomUsers };
        });
    }
    recycleUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const recycleUsers = yield this.userService.getRecycleUsers();
            return { code: 200, message: "获取所有回收站用户成功", recycleUsers };
        });
    }
    userInfos(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const userInfos = yield this.userService.userInfos(id);
            return { code: 200, message: "获取指定用户信息成功", userInfos };
        });
    }
    rolesInUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const roles = yield this.userService.roles(id);
            return { code: 200, message: "获取指定用户角色成功", roles };
        });
    }
    permissionsInUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const permissions = yield this.userService.permissions(id);
            return { code: 200, message: "获取指定用户角色成功", permissions };
        });
    }
    createUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organizationId, userName, password } = body;
            if (!userName || !password) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.createUser(organizationId, userName, password);
            return { code: 200, message: "创建用户成功" };
        });
    }
    createUserWithUserInfo(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organizationId, userName, password, groups } = body;
            if (!userName || !password) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.createUserWithUserInfo(req, organizationId, userName, password, groups);
            return { code: 200, message: "创建用户成功" };
        });
    }
    addUserInfo(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, groups } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.addUserInfoToUser(req, id, groups);
            return { code: 200, message: "创建用户成功" };
        });
    }
    updateUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userName, password } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.updateUser(id, userName, password);
            return { code: 200, message: "更新用户成功" };
        });
    }
    bannedUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.bannedUser(id);
            return { code: 200, message: "封禁用户成功" };
        });
    }
    unBannedUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.unBannedUser(id);
            return { code: 200, message: "解封用户成功" };
        });
    }
    softDeleteUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.softDeleteUser(id);
            return { code: 200, message: "删除用户到回收站成功" };
        });
    }
    restoreUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.restoreUser(id);
            return { code: 200, message: "还原用户成功" };
        });
    }
    restoreUsers(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = body;
            if (!ids || ids.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.restoreUsers(ids);
            return { code: 200, message: "还原多个用户成功" };
        });
    }
    deleteUser(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.deleteUser(id);
            return { code: 200, message: "删除用户成功" };
        });
    }
    deleteUsers(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = body;
            if (!ids || ids.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.deleteUsers(ids);
            return { code: 200, message: "删除用户成功" };
        });
    }
    setRoles(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, roleIds } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.setRoles(id, roleIds);
            return { code: 200, message: "设置用户角色成功" };
        });
    }
    setUserOwnPermissions(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, permissionIds } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.userService.setPermissions(id, permissionIds);
            return { code: 200, message: "设置用户权限成功" };
        });
    }
};
__decorate([
    graphql_1.Query("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    graphql_1.Query("freedomUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "freedomUsers", null);
__decorate([
    graphql_1.Query("recycleUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "recycleUsers", null);
__decorate([
    graphql_1.Query("userInfos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userInfos", null);
__decorate([
    graphql_1.Query("rolesInUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "rolesInUser", null);
__decorate([
    graphql_1.Query("permissionsInUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "permissionsInUser", null);
__decorate([
    graphql_1.Mutation("createUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    graphql_1.Mutation("createUserWithUserInfo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUserWithUserInfo", null);
__decorate([
    graphql_1.Mutation("addUserInfo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "addUserInfo", null);
__decorate([
    graphql_1.Mutation("updateUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    graphql_1.Mutation("bannedUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "bannedUser", null);
__decorate([
    graphql_1.Mutation("unBannedUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "unBannedUser", null);
__decorate([
    graphql_1.Mutation("softDeleteUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "softDeleteUser", null);
__decorate([
    graphql_1.Mutation("restoreUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "restoreUser", null);
__decorate([
    graphql_1.Mutation("restoreUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "restoreUsers", null);
__decorate([
    graphql_1.Mutation("deleteUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    graphql_1.Mutation("deleteUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUsers", null);
__decorate([
    graphql_1.Mutation("setRoles"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "setRoles", null);
__decorate([
    graphql_1.Mutation("setUserOwnPermissions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "setUserOwnPermissions", null);
UserResolver = __decorate([
    graphql_1.Resolver("User"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(user_service_1.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
exports.UserResolver = UserResolver;

//# sourceMappingURL=user.resolver.js.map
