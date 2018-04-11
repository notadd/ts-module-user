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
const organization_service_1 = require("../service/organization.service");
let OrganizationResolver = class OrganizationResolver {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    roots() {
        return __awaiter(this, void 0, void 0, function* () {
            const roots = yield this.organizationService.getRoots();
            return { code: 200, message: "获取所有根组织成功", roots };
        });
    }
    children(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const children = yield this.organizationService.getChildren(id);
            return { code: 200, message: "获取子组织成功", children };
        });
    }
    organizations() {
        return __awaiter(this, void 0, void 0, function* () {
            const organizations = yield this.organizationService.getAll();
            return { code: 200, message: "获取所有组织成功", organizations: [] };
        });
    }
    createOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, parentId } = body;
            if (!name) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (parentId && !Number.isInteger(parentId)) {
                throw new common_1.HttpException("父组织Id不是整数", 401);
            }
            yield this.organizationService.createOrganization(name, parentId);
            return { code: 200, message: "创建组织成功" };
        });
    }
    updateOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, parentId } = body;
            if (!id || !name) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (parentId && !Number.isInteger(parentId)) {
                throw new common_1.HttpException("父组织Id不是整数", 401);
            }
            yield this.organizationService.updateOrganization(id, name, parentId);
            return { code: 200, message: "更新组织成功" };
        });
    }
    deleteOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.organizationService.deleteOrganization(id);
            return { code: 200, message: "删除组织成功" };
        });
    }
    usersInOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const users = yield this.organizationService.getUsersInOrganization(id);
            return { code: 200, message: "获取组织用户成功", users };
        });
    }
    addUserToOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userId } = body;
            if (!id || !userId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.organizationService.addUserToOrganization(id, userId);
            return { code: 200, message: "向组织添加用户成功", };
        });
    }
    addUsersToOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userIds } = body;
            if (!id || !userIds || userIds.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.organizationService.addUsersToOrganization(id, userIds);
            return { code: 200, message: "向组织添加多个用户成功" };
        });
    }
    removeUserFromOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userId } = body;
            if (!id || !userId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.organizationService.removeUserFromOrganization(id, userId);
            return { code: 200, message: "从组织移除用户成功" };
        });
    }
    removeUsersFromOrganization(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userIds } = body;
            if (!id || !userIds || userIds.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.organizationService.removeUsersFromOrganization(id, userIds);
            return { code: 200, message: "从组织移除多个用户成功" };
        });
    }
};
__decorate([
    graphql_1.Query("roots"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "roots", null);
__decorate([
    graphql_1.Query("children"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "children", null);
__decorate([
    graphql_1.Query("organizations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "organizations", null);
__decorate([
    graphql_1.Mutation("createOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "createOrganization", null);
__decorate([
    graphql_1.Mutation("updateOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "updateOrganization", null);
__decorate([
    graphql_1.Mutation("deleteOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "deleteOrganization", null);
__decorate([
    graphql_1.Query("usersInOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "usersInOrganization", null);
__decorate([
    graphql_1.Mutation("addUserToOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "addUserToOrganization", null);
__decorate([
    graphql_1.Mutation("addUsersToOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "addUsersToOrganization", null);
__decorate([
    graphql_1.Mutation("removeUserFromOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "removeUserFromOrganization", null);
__decorate([
    graphql_1.Mutation("removeUsersFromOrganization"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], OrganizationResolver.prototype, "removeUsersFromOrganization", null);
OrganizationResolver = __decorate([
    graphql_1.Resolver("Organization"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(organization_service_1.OrganizationService)),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationResolver);
exports.OrganizationResolver = OrganizationResolver;
