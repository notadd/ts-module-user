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
var score_type_entity_1 = require("../model/score.type.entity");
var ScoreTypeService = /** @class */ (function () {
    function ScoreTypeService(scoreTypeRepository) {
        this.scoreTypeRepository = scoreTypeRepository;
    }
    ScoreTypeService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScoreTypeService.prototype.createScoreType = function (name, type, description) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, scoreType, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.findOne({ name: name })];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定名称name=" + name + "积分类型已存在", 424);
                        }
                        scoreType = this.scoreTypeRepository.create({ name: name, type: type, "default": false, description: description });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.scoreTypeRepository.save(scoreType)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_1.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ScoreTypeService.prototype.updateScoreType = function (id, name, type, description) {
        return __awaiter(this, void 0, void 0, function () {
            var original, exist, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.findOneById(id)];
                    case 1:
                        original = _a.sent();
                        if (!original) {
                            throw new common_1.HttpException("指定id=" + id + "积分类型不存在", 425);
                        }
                        if (original["default"]) {
                            throw new common_1.HttpException("默认积分类型不允许更改", 426);
                        }
                        if (!(name !== original.name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.scoreTypeRepository.findOne({ name: name })];
                    case 2:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定名称name=" + name + "积分类型已存在", 424);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        original.name = name;
                        original.type = type;
                        original.description = description;
                        return [4 /*yield*/, this.scoreTypeRepository.save(original)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_2.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ScoreTypeService.prototype.deleteScoreType = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("指定id=" + id + "积分类型不存在", 425);
                        }
                        if (exist["default"]) {
                            throw new common_1.HttpException("默认积分类型不允许删除", 426);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.scoreTypeRepository.remove(exist)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_3.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ScoreTypeService.prototype.deleteScoreTypes = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scoreTypeRepository.findByIds(ids)];
                    case 1:
                        exists = _a.sent();
                        ids.forEach(function (id) {
                            var find = exists.find(function (exist) {
                                return exist.id === id;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + id + "积分类型不存在", 425);
                            }
                            if (find["default"]) {
                                throw new common_1.HttpException("默认积分类型不允许删除", 426);
                            }
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.scoreTypeRepository.remove(exists)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_4.toString(), 401);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ScoreTypeService = __decorate([
        common_1.Component(),
        __param(0, typeorm_1.InjectRepository(score_type_entity_1.ScoreType))
    ], ScoreTypeService);
    return ScoreTypeService;
}());
exports.ScoreTypeService = ScoreTypeService;
