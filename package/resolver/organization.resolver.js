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
var organization_service_1 = require("../service/organization.service");
var OrganizationResolver = /** @class */ (function () {
    function OrganizationResolver(organizationService) {
        this.organizationService = organizationService;
    }
    /* 查找所有根组织 */
    OrganizationResolver.prototype.roots = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationService.getRoots()];
                    case 1:
                        roots = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取所有根组织成功", roots: roots }];
                }
            });
        });
    };
    /* 查找指定组织的所有子组织 */
    OrganizationResolver.prototype.children = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, children;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.getChildren(id)];
                    case 1:
                        children = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取子组织成功", children: children }];
                }
            });
        });
    };
    /* 查找所有现存组织 */
    OrganizationResolver.prototype.organizations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var organizations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationService.getAll()];
                    case 1:
                        organizations = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取所有组织成功", organizations: [] }];
                }
            });
        });
    };
    /* 创建指定名称组织，可选是否指定父组织id */
    OrganizationResolver.prototype.createOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var name, parentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = body.name, parentId = body.parentId;
                        if (!name) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        if (parentId && !Number.isInteger(parentId)) {
                            throw new common_1.HttpException("父组织Id不是整数", 401);
                        }
                        return [4 /*yield*/, this.organizationService.createOrganization(name, parentId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "创建组织成功" }];
                }
            });
        });
    };
    /* 更新指定id组织，可更新组织名、父组织 */
    OrganizationResolver.prototype.updateOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, name, parentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, name = body.name, parentId = body.parentId;
                        if (!id || !name) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        if (parentId && !Number.isInteger(parentId)) {
                            throw new common_1.HttpException("父组织Id不是整数", 401);
                        }
                        return [4 /*yield*/, this.organizationService.updateOrganization(id, name, parentId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "更新组织成功" }];
                }
            });
        });
    };
    /* 删除指定id组织，默认情况下有子组织会报错，不能删除
       可以指定force=true，强制删除组织及其子孙组织
    */
    OrganizationResolver.prototype.deleteOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.deleteOrganization(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "删除组织成功" }];
                }
            });
        });
    };
    /* 查找指定组织下所有用户 */
    OrganizationResolver.prototype.usersInOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.getUsersInOrganization(id)];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取组织用户成功", users: users }];
                }
            });
        });
    };
    /* 向指定组织添加一个指定用户 */
    OrganizationResolver.prototype.addUserToOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, userId = body.userId;
                        if (!id || !userId) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.addUserToOrganization(id, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "向组织添加用户成功" }];
                }
            });
        });
    };
    /* 向指定组织添加多个指定用户 */
    OrganizationResolver.prototype.addUsersToOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, userIds = body.userIds;
                        if (!id || !userIds || userIds.length === 0) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.addUsersToOrganization(id, userIds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "向组织添加多个用户成功" }];
                }
            });
        });
    };
    /* 将指定用户从组织中移除 */
    OrganizationResolver.prototype.removeUserFromOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, userId = body.userId;
                        if (!id || !userId) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.removeUserFromOrganization(id, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "从组织移除用户成功" }];
                }
            });
        });
    };
    /* 将指定多个用户从组织中移除 */
    OrganizationResolver.prototype.removeUsersFromOrganization = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, userIds = body.userIds;
                        if (!id || !userIds || userIds.length === 0) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.organizationService.removeUsersFromOrganization(id, userIds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "从组织移除多个用户成功" }];
                }
            });
        });
    };
    __decorate([
        graphql_1.Query("roots")
    ], OrganizationResolver.prototype, "roots");
    __decorate([
        graphql_1.Query("children")
    ], OrganizationResolver.prototype, "children");
    __decorate([
        graphql_1.Query("organizations")
    ], OrganizationResolver.prototype, "organizations");
    __decorate([
        graphql_1.Mutation("createOrganization")
    ], OrganizationResolver.prototype, "createOrganization");
    __decorate([
        graphql_1.Mutation("updateOrganization")
    ], OrganizationResolver.prototype, "updateOrganization");
    __decorate([
        graphql_1.Mutation("deleteOrganization")
    ], OrganizationResolver.prototype, "deleteOrganization");
    __decorate([
        graphql_1.Query("usersInOrganization")
    ], OrganizationResolver.prototype, "usersInOrganization");
    __decorate([
        graphql_1.Mutation("addUserToOrganization")
    ], OrganizationResolver.prototype, "addUserToOrganization");
    __decorate([
        graphql_1.Mutation("addUsersToOrganization")
    ], OrganizationResolver.prototype, "addUsersToOrganization");
    __decorate([
        graphql_1.Mutation("removeUserFromOrganization")
    ], OrganizationResolver.prototype, "removeUserFromOrganization");
    __decorate([
        graphql_1.Mutation("removeUsersFromOrganization")
    ], OrganizationResolver.prototype, "removeUsersFromOrganization");
    OrganizationResolver = __decorate([
        graphql_1.Resolver("Organization"),
        common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
        __param(0, common_1.Inject(organization_service_1.OrganizationService))
    ], OrganizationResolver);
    return OrganizationResolver;
}());
exports.OrganizationResolver = OrganizationResolver;
