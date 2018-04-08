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
const ExceptionInterceptor_1 = require("../interceptor/ExceptionInterceptor");
const ScoreTypeService_1 = require("../service/ScoreTypeService");
let ScoreTypeResolver = class ScoreTypeResolver {
    constructor(scoreTypeService) {
        this.scoreTypeService = scoreTypeService;
    }
    scoreTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            let scoreTypes = yield this.scoreTypeService.getAll();
            return { code: 200, message: '获取所有积分类型成功', scoreTypes };
        });
    }
    createScoreType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { name, type, description } = body;
            if (!name || !type) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (type !== 'float' && type !== 'int') {
                throw new common_1.HttpException('参数错误', 400);
            }
            yield this.scoreTypeService.createScoreType(name, type, description);
            return { code: 200, message: '创建积分类型成功' };
        });
    }
    updateScoreType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, type, description } = body;
            if (!id || !name || !type) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (type !== 'float' && type !== 'int') {
                throw new common_1.HttpException('参数错误', 400);
            }
            yield this.scoreTypeService.updateScoreType(id, name, type, description);
            return { code: 200, message: '更新积分类型成功' };
        });
    }
    deleteScoreType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id } = body;
            if (!id) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            yield this.scoreTypeService.deleteScoreType(id);
            return { code: 200, message: '删除积分类型成功' };
        });
    }
    deleteScoreTypes(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { ids } = body;
            if (!ids || ids.length === 0) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            yield this.scoreTypeService.deleteScoreTypes(ids);
            return { code: 200, message: '批量删除积分类型成功' };
        });
    }
};
__decorate([
    graphql_1.Query('scoreTypes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScoreTypeResolver.prototype, "scoreTypes", null);
__decorate([
    graphql_1.Mutation('createScoreType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ScoreTypeResolver.prototype, "createScoreType", null);
__decorate([
    graphql_1.Mutation('updateScoreType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ScoreTypeResolver.prototype, "updateScoreType", null);
__decorate([
    graphql_1.Mutation('deleteScoreType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ScoreTypeResolver.prototype, "deleteScoreType", null);
__decorate([
    graphql_1.Mutation('deleteScoreTypes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ScoreTypeResolver.prototype, "deleteScoreTypes", null);
ScoreTypeResolver = __decorate([
    graphql_1.Resolver('ScoreType'),
    common_1.UseInterceptors(ExceptionInterceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(ScoreTypeService_1.ScoreTypeService)),
    __metadata("design:paramtypes", [ScoreTypeService_1.ScoreTypeService])
], ScoreTypeResolver);
exports.ScoreTypeResolver = ScoreTypeResolver;
