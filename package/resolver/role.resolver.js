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
const role_service_1 = require("../service/role.service");
let RoleResolver = class RoleResolver {
    constructor(roleService) {
        this.roleService = roleService;
    }
    createRole(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { moduleToken, name, score } = body;
            if (!moduleToken || !name || !score) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.roleService.createRole(moduleToken, name, score);
            return { code: 200, message: "创建角色成功" };
        });
    }
    updateRole(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, score } = body;
            if (!id || !name || !score) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.roleService.updateRole(id, name, score);
            return { code: 200, message: "更新角色成功" };
        });
    }
    deleteRole(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.roleService.deleteRole(id);
            return { code: 200, message: "删除角色成功" };
        });
    }
    setFuncs(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, funcIds } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.roleService.setFuncs(id, funcIds);
            return { code: 200, message: "设置角色功能成功" };
        });
    }
};
__decorate([
    graphql_1.Mutation("createRole"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "createRole", null);
__decorate([
    graphql_1.Mutation("updateRole"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "updateRole", null);
__decorate([
    graphql_1.Mutation("deleteRole"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "deleteRole", null);
__decorate([
    graphql_1.Mutation("setFuncs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "setFuncs", null);
RoleResolver = __decorate([
    graphql_1.Resolver("Role"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(role_service_1.RoleService)),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleResolver);
exports.RoleResolver = RoleResolver;
