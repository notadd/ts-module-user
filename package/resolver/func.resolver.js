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
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const common_1 = require("@nestjs/common");
const func_service_1 = require("../service/func.service");
const graphql_1 = require("@nestjs/graphql");
let FuncResolver = class FuncResolver {
    constructor(funcService) {
        this.funcService = funcService;
    }
    createFunc(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { moduleToken, name } = body;
            if (!moduleToken || !name) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.funcService.createFunc(moduleToken, name);
            return { code: 200, message: "创建功能成功" };
        });
    }
    updateFunc(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name } = body;
            if (!id || !name) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.funcService.updateFunc(id, name);
            return { code: 200, message: "更新功能成功" };
        });
    }
    deleteFunc(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.funcService.deleteFunc(id);
            return { code: 200, message: "删除功能成功" };
        });
    }
    setPermissions(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, permissionIds } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.funcService.setPermissions(id, permissionIds);
            return { code: 200, message: "设置功能权限成功" };
        });
    }
};
__decorate([
    graphql_1.Mutation("createFunc"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FuncResolver.prototype, "createFunc", null);
__decorate([
    graphql_1.Mutation("updateFunc"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FuncResolver.prototype, "updateFunc", null);
__decorate([
    graphql_1.Mutation("deleteFunc"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FuncResolver.prototype, "deleteFunc", null);
__decorate([
    graphql_1.Mutation("setPermissions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FuncResolver.prototype, "setPermissions", null);
FuncResolver = __decorate([
    graphql_1.Resolver("Func"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(func_service_1.FuncService)),
    __metadata("design:paramtypes", [func_service_1.FuncService])
], FuncResolver);
exports.FuncResolver = FuncResolver;

//# sourceMappingURL=func.resolver.js.map
