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
var score_service_1 = require("../service/score.service");
var ScoreResolver = /** @class */ (function () {
    function ScoreResolver(scoreService) {
        this.scoreService = scoreService;
    }
    ScoreResolver.prototype.getScore = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, scoreTypeId, score;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = body.userId, scoreTypeId = body.scoreTypeId;
                        if (!userId || !scoreTypeId) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.scoreService.getScore(userId, scoreTypeId)];
                    case 1:
                        score = _a.sent();
                        return [2 /*return*/, { code: 200, message: "获取积分成功", score: score }];
                }
            });
        });
    };
    ScoreResolver.prototype.setScore = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, scoreTypeId, add;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = body.userId, scoreTypeId = body.scoreTypeId, add = body.add;
                        if (!userId || !scoreTypeId) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.scoreService.setScore(userId, scoreTypeId, add)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "设置积分成功" }];
                }
            });
        });
    };
    __decorate([
        graphql_1.Query("getScore")
    ], ScoreResolver.prototype, "getScore");
    __decorate([
        graphql_1.Mutation("setScore")
    ], ScoreResolver.prototype, "setScore");
    ScoreResolver = __decorate([
        graphql_1.Resolver("Score"),
        common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
        __param(0, common_1.Inject(score_service_1.ScoreService))
    ], ScoreResolver);
    return ScoreResolver;
}());
exports.ScoreResolver = ScoreResolver;
