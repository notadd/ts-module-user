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
const info_item_service_1 = require("../service/info.item.service");
let InfoItemResolver = class InfoItemResolver {
    constructor(infoItemService) {
        this.infoItemService = infoItemService;
    }
    createInfoItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, label, description, type, necessary, registerVisible, informationVisible, order } = body;
            if (!name || !label || !type || necessary === undefined || necessary === null) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoItemService.createInfoItem(name, label, description, type, necessary, registerVisible, informationVisible, order);
            return { code: 200, message: "创建信息项成功" };
        });
    }
    updateInfoItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, label, description, type, necessary, registerVisible, informationVisible, order } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoItemService.updateInfoItem(id, name, label, description, type, necessary, registerVisible, informationVisible, order);
            return { code: 200, message: "更新信息项成功" };
        });
    }
    deleteInfoItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoItemService.deleteInfoItem(id);
            return { code: 200, message: "删除信息项成功" };
        });
    }
    deleteInfoItems(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = body;
            if (!ids || ids.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.infoItemService.deleteInfoItems(ids);
            return { code: 200, message: "删除多个信息项成功" };
        });
    }
};
__decorate([
    graphql_1.Mutation("createInfoItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], InfoItemResolver.prototype, "createInfoItem", null);
__decorate([
    graphql_1.Mutation("updateInfoItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], InfoItemResolver.prototype, "updateInfoItem", null);
__decorate([
    graphql_1.Mutation("deleteInfoItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], InfoItemResolver.prototype, "deleteInfoItem", null);
__decorate([
    graphql_1.Mutation("deleteInfoItems"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], InfoItemResolver.prototype, "deleteInfoItems", null);
InfoItemResolver = __decorate([
    graphql_1.Resolver("InfoItem"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(info_item_service_1.InfoItemService)),
    __metadata("design:paramtypes", [info_item_service_1.InfoItemService])
], InfoItemResolver);
exports.InfoItemResolver = InfoItemResolver;

//# sourceMappingURL=info.item.resolver.js.map
