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
var info_group_entity_1 = require("../model/info.group.entity");
var info_item_entity_1 = require("../model/info.item.entity");
var InfoGroupService = /** @class */ (function () {
    function InfoGroupService(infoItemRepository, infoGroupRepository) {
        this.infoItemRepository = infoItemRepository;
        this.infoGroupRepository = infoGroupRepository;
    }
    /* 获取所有信息组 */
    InfoGroupService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* 获取指定信息组的信息项，不管信息组状态如何都能获取到 */
    InfoGroupService.prototype.getInfoItems = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var infoGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.findOneById(id, { relations: ["items"] })];
                    case 1:
                        infoGroup = _a.sent();
                        return [2 /*return*/, infoGroup.items];
                }
            });
        });
    };
    /* 创建信息组 */
    InfoGroupService.prototype.createInfoGroup = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, infoGroup, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.findOne({ name: name })];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("给定名称name=" + name + "信息组已存在", 407);
                        }
                        infoGroup = this.infoGroupRepository.create({ name: name, "default": false, status: true });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.infoGroupRepository.save(infoGroup)];
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
    /* 更新信息组 */
    InfoGroupService.prototype.updateInfoGroup = function (id, name) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, exist1, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
                        }
                        //默认信息组无法更新
                        if (exist["default"]) {
                            throw new common_1.HttpException("默认信息组不可更改", 408);
                        }
                        if (!(name !== exist.name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoGroupRepository.findOne({ name: name })];
                    case 2:
                        exist1 = _a.sent();
                        if (exist1) {
                            throw new common_1.HttpException("指定名称信息组已存在：" + name, 408);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        exist.name = name;
                        return [4 /*yield*/, this.infoGroupRepository.save(exist)];
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
    /* 删除信息组，目前由于信息组与信息项是多对多关系，删除信息组只会解除关系，不会删除信息项 */
    InfoGroupService.prototype.deleteInfoGroup = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.findOneById(id)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
                        }
                        //默认信息组无法删除
                        if (exist["default"]) {
                            throw new common_1.HttpException("默认信息组不可删除", 408);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.infoGroupRepository.remove(exist)];
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
    /* 向指定信息组添加信息项 */
    InfoGroupService.prototype.addInfoItem = function (id, infoItemId) {
        return __awaiter(this, void 0, void 0, function () {
            var group, item, find, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.findOneById(id, { relations: ["items"] })];
                    case 1:
                        group = _a.sent();
                        if (!group) {
                            throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
                        }
                        //不能向默认信息组添加新项
                        if (group["default"]) {
                            throw new common_1.HttpException("默认信息组不可更改", 408);
                        }
                        return [4 /*yield*/, this.infoItemRepository.findOneById(infoItemId)];
                    case 2:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.HttpException("指定id=" + infoItemId + "信息项不存在", 409);
                        }
                        //默认信息项也不能添加到别的组
                        if (item["default"]) {
                            throw new common_1.HttpException("默认信息项不可添加", 408);
                        }
                        find = group.items.find(function (item) {
                            return item.id === id;
                        });
                        //如果已经存在，报错
                        if (find) {
                            throw new common_1.HttpException("指定信息项id=" + infoItemId + "已经存在于指定信息组id=" + id + "中", 410);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        group.items.push(item);
                        return [4 /*yield*/, this.infoGroupRepository.save(group)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_4 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_4.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /* 从信息组移除信息项 */
    InfoGroupService.prototype.removeInfoItem = function (id, infoItemId) {
        return __awaiter(this, void 0, void 0, function () {
            var group, item, index, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoGroupRepository.findOneById(id, { relations: ["items"] })];
                    case 1:
                        group = _a.sent();
                        if (!group) {
                            throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
                        }
                        //默认信息组不能更改
                        if (group["default"]) {
                            throw new common_1.HttpException("默认信息组不可更改", 408);
                        }
                        return [4 /*yield*/, this.infoItemRepository.findOneById(infoItemId)];
                    case 2:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.HttpException("指定id=" + infoItemId + "信息项不存在", 409);
                        }
                        index = group.items.findIndex(function (item) {
                            return item.id === id;
                        });
                        //如果信息项不存在信息组中，报错
                        if (index < 0) {
                            throw new common_1.HttpException("指定信息项id=" + infoItemId + "不存在于指定信息组id=" + id + "中", 411);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        group.items.splice(index, 1);
                        return [4 /*yield*/, this.infoGroupRepository.save(group)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_5 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_5.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    InfoGroupService = __decorate([
        common_1.Component(),
        __param(0, typeorm_1.InjectRepository(info_item_entity_1.InfoItem)),
        __param(1, typeorm_1.InjectRepository(info_group_entity_1.InfoGroup))
    ], InfoGroupService);
    return InfoGroupService;
}());
exports.InfoGroupService = InfoGroupService;
