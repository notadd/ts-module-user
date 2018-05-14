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
const info_group_service_1 = require("../service/info.group.service");
const graphql_1 = require("@nestjs/graphql");
let InfoGroupResolver = class InfoGroupResolver {
    constructor(infoGroupService) {
        this.infoGroupService = infoGroupService;
    }
    infoGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const infoGroups = yield this.infoGroupService.getAll();
            return { code: 200, message: "获取所有信息组成功", infoGroups };
        });
    }
    infoItems(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const infoItems = yield this.infoGroupService.getInfoItems(id);
            return { code: 200, message: "获取指定信息组的信息项成功", infoItems };
        });
    }
    createInfoGroup(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = body;
            if (!name) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoGroupService.createInfoGroup(name);
            return { code: 200, message: "创建信息组成功" };
        });
    }
    updateInfoGroup(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name } = body;
            if (!id || !name) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoGroupService.updateInfoGroup(id, name);
            return { code: 200, message: "更新信息组成功" };
        });
    }
    deleteInfoGroup(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoGroupService.deleteInfoGroup(id);
            return { code: 200, message: "删除信息组成功" };
        });
    }
    addInfoItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, infoItemId } = body;
            if (!id || !infoItemId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoGroupService.addInfoItem(id, infoItemId);
            return { code: 200, message: "添加信息项成功" };
        });
    }
    removeInfoItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, infoItemId } = body;
            if (!id || !infoItemId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoGroupService.removeInfoItem(id, infoItemId);
            return { code: 200, message: "移除信息项成功" };
        });
    }
};
__decorate([
    graphql_1.Query("infoGroups"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "infoGroups", null);
__decorate([
    graphql_1.Query("infoItems"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "infoItems", null);
__decorate([
    graphql_1.Mutation("createInfoGroup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "createInfoGroup", null);
__decorate([
    graphql_1.Mutation("updateInfoGroup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "updateInfoGroup", null);
__decorate([
    graphql_1.Mutation("deleteInfoGroup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "deleteInfoGroup", null);
__decorate([
    graphql_1.Mutation("addInfoItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "addInfoItem", null);
__decorate([
    graphql_1.Mutation("removeInfoItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InfoGroupResolver.prototype, "removeInfoItem", null);
InfoGroupResolver = __decorate([
    graphql_1.Resolver("InfoGroup"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(info_group_service_1.InfoGroupService)),
    __metadata("design:paramtypes", [info_group_service_1.InfoGroupService])
], InfoGroupResolver);
exports.InfoGroupResolver = InfoGroupResolver;

//# sourceMappingURL=info.group.resolver.js.map
