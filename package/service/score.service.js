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
var typeorm_1 = require("@nestjs/typeorm");
var score_entity_1 = require("../model/score.entity");
var score_type_entity_1 = require("../model/score.type.entity");
var user_entity_1 = require("../model/user.entity");
var float_util_1 = require("../util/float.util");
var ScoreService = /** @class */ (function () {
    function ScoreService(floatUtil, userRepository, scoreRepository, scoreTypeRepository) {
        this.floatUtil = floatUtil;
        this.userRepository = userRepository;
        this.scoreRepository = scoreRepository;
        this.scoreTypeRepository = scoreTypeRepository;
    }
    ScoreService.prototype.getScore = function (userId, scoreTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            var scoreType, user, score, score_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.findOneById(scoreTypeId)];
                    case 1:
                        scoreType = _a.sent();
                        if (!scoreType) {
                            throw new common_1.HttpException("指定id=" + scoreTypeId + "积分类型不存在", 427);
                        }
                        return [4 /*yield*/, this.userRepository.findOneById(userId, { relations: ["scores"] })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + userId + "用户不存在", 428);
                        }
                        score = user.scores.find(function (score) {
                            return score.scoreTypeId === scoreType.id;
                        });
                        if (!score) return [3 /*break*/, 3];
                        if (scoreType.type === "int") {
                            return [2 /*return*/, Number.parseInt(score.value + "")];
                        }
                        else if (scoreType.type === "float") {
                            return [2 /*return*/, Number.parseFloat(score.value + "")];
                        }
                        return [3 /*break*/, 8];
                    case 3:
                        score_1 = this.scoreRepository.create({ value: 0, scoreType: scoreType, user: user });
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.scoreRepository.save(score_1)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_1.toString(), 401);
                    case 7: return [2 /*return*/, 0];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ScoreService.prototype.setScore = function (userId, scoreTypeId, add) {
        return __awaiter(this, void 0, void 0, function () {
            var scoreType, user, score, _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.findOneById(scoreTypeId)];
                    case 1:
                        scoreType = _b.sent();
                        if (!scoreType) {
                            throw new common_1.HttpException("指定id=" + scoreTypeId + "积分类型不存在", 427);
                        }
                        return [4 /*yield*/, this.userRepository.findOneById(userId, { relations: ["scores"] })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            throw new common_1.HttpException("指定id=" + userId + "用户不存在", 428);
                        }
                        score = user.scores.find(function (score) {
                            return score.scoreTypeId === scoreType.id;
                        });
                        if (!score) return [3 /*break*/, 6];
                        if (!(scoreType.type === "int")) return [3 /*break*/, 3];
                        score.value = Number.parseInt(score.value + "") + Number.parseInt(add + "");
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(scoreType.type === "float")) return [3 /*break*/, 5];
                        _a = score;
                        return [4 /*yield*/, this.floatUtil.add(score.value, add)];
                    case 4:
                        _a.value = _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        score = this.scoreRepository.create({ scoreType: scoreType, user: user });
                        if (scoreType.type === "int") {
                            score.value = Number.parseInt(add + "");
                        }
                        else if (scoreType.type === "float") {
                            score.value = Number.parseFloat(add + "");
                        }
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.scoreRepository.save(score)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        err_2 = _b.sent();
                        throw new common_1.HttpException("数据库错误" + err_2.toString(), 401);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ScoreService = __decorate([
        common_1.Component(),
        __param(0, common_1.Inject(float_util_1.FloatUtil)),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(2, typeorm_1.InjectRepository(score_entity_1.Score)),
        __param(3, typeorm_1.InjectRepository(score_type_entity_1.ScoreType))
    ], ScoreService);
    return ScoreService;
}());
exports.ScoreService = ScoreService;
