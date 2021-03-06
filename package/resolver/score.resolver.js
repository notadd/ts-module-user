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
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const score_service_1 = require("../service/score.service");
let ScoreResolver = class ScoreResolver {
    constructor(scoreService) {
        this.scoreService = scoreService;
    }
    getScore(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, scoreTypeId } = body;
            if (!userId || !scoreTypeId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const score = yield this.scoreService.getScore(userId, scoreTypeId);
            return { code: 200, message: "获取积分成功", score };
        });
    }
    setScore(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, scoreTypeId, add } = body;
            if (!userId || !scoreTypeId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.scoreService.setScore(userId, scoreTypeId, add);
            return { code: 200, message: "设置积分成功" };
        });
    }
};
__decorate([
    graphql_1.Query("getScore"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScoreResolver.prototype, "getScore", null);
__decorate([
    graphql_1.Mutation("setScore"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScoreResolver.prototype, "setScore", null);
ScoreResolver = __decorate([
    graphql_1.Resolver("Score"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(score_service_1.ScoreService)),
    __metadata("design:paramtypes", [score_service_1.ScoreService])
], ScoreResolver);
exports.ScoreResolver = ScoreResolver;

//# sourceMappingURL=score.resolver.js.map
