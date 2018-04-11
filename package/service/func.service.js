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
var func_entity_1 = require("../model/func.entity");
var module_entity_1 = require("../model/module.entity");
var permission_entity_1 = require("../model/permission.entity");
var FuncService = /** @class */ (function () {
    function FuncService(funcRepository, moduleRepository, permissionRepository) {
        this.funcRepository = funcRepository;
        this.moduleRepository = moduleRepository;
        this.permissionRepository = permissionRepository;
    }
    FuncService.prototype.createFunc = function (moduleToken, name) {
        return __awaiter(this, void 0, void 0, function () {
            var module, exist, func, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moduleRepository.findOneById(moduleToken)];
                    case 1:
                        module = _a.sent();
                        if (!module) {
                            throw new common_1.HttpException("指定模块token=" + moduleToken + "不存在", 415);
                        }
                        return [4 /*yield*/, this.funcRepository.findOne({ name: name, moduleToken: moduleToken })];
                    case 2:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定模块token=" + moduleToken + "下，指定名称name=" + name + "功能已经存在", 416);
                        }
                        func = this.funcRepository.create({ name: name, module: module });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.funcRepository.save(func)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        throw new common_1.HttpException("数据库错误" + err_1.toString(), 401);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FuncService.prototype.updateFunc = function (id, name) {
        return __awaiter(this, void 0, void 0, function () {
            var func, exist, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.funcRepository.findOneById(id)];
                    case 1:
                        func = _a.sent();
                        if (!func) {
                            throw new common_1.HttpException("指定id=" + id + "功能不存在", 417);
                        }
                        if (!(name !== func.name)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.funcRepository.findOne({ name: name, moduleToken: func.moduleToken })];
                    case 2:
                        exist = _a.sent();
                        if (exist) {
                            throw new common_1.HttpException("指定模块token=" + func.moduleToken + "下，指定名称name=" + name + "功能已经存在", 416);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        func.name = name;
                        return [4 /*yield*/, this.funcRepository.save(func)];
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
    FuncService.prototype.deleteFunc = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var func, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.funcRepository.findOneById(id)];
                    case 1:
                        func = _a.sent();
                        if (!func) {
                            throw new common_1.HttpException("指定id=" + id + "功能不存在", 417);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.funcRepository.remove(func)];
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
    FuncService.prototype.setPermissions = function (id, permissionIds) {
        return __awaiter(this, void 0, void 0, function () {
            var func, pers, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.funcRepository.findOneById(id, { relations: ["permissions"] })];
                    case 1:
                        func = _a.sent();
                        if (!func) {
                            throw new common_1.HttpException("指定id=" + id + "功能不存在", 417);
                        }
                        return [4 /*yield*/, this.permissionRepository.findByIds(permissionIds, { relations: ["module"] })
                            //检查是否所有指定权限都存在
                        ];
                    case 2:
                        pers = _a.sent();
                        //检查是否所有指定权限都存在
                        permissionIds.forEach(function (permissionId) {
                            var find = pers.find(function (per) {
                                return per.id === permissionId;
                            });
                            if (!find) {
                                throw new common_1.HttpException("指定id=" + permissionId + "权限不存在", 418);
                            }
                            if (find.moduleToken !== func.moduleToken) {
                                throw new common_1.HttpException("指定功能、权限只能属于同一个模块", 419);
                            }
                        });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        func.permissions = pers;
                        return [4 /*yield*/, this.funcRepository.save(func)];
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
    FuncService = __decorate([
        common_1.Component(),
        __param(0, typeorm_1.InjectRepository(func_entity_1.Func)),
        __param(1, typeorm_1.InjectRepository(module_entity_1.Module)),
        __param(2, typeorm_1.InjectRepository(permission_entity_1.Permission))
    ], FuncService);
    return FuncService;
}());
exports.FuncService = FuncService;
