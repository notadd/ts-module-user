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
var info_item_service_1 = require("../service/info.item.service");
/* 这个几个接口只是写在这，使用上还有很多问题,因为信息项可能不会编辑，所以不一定有用 */
var InfoItemResolver = /** @class */ (function () {
    function InfoItemResolver(infoItemService) {
        this.infoItemService = infoItemService;
    }
    InfoItemResolver.prototype.createInfoItem = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var name, label, description, type, necessary, registerVisible, informationVisible, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = body.name, label = body.label, description = body.description, type = body.type, necessary = body.necessary, registerVisible = body.registerVisible, informationVisible = body.informationVisible, order = body.order;
                        if (!name || !label || !type || necessary === undefined || necessary === null) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.infoItemService.createInfoItem(name, label, description, type, necessary, registerVisible, informationVisible, order)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "创建信息项成功" }];
                }
            });
        });
    };
    InfoItemResolver.prototype.updateInfoItem = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id, name, label, description, type, necessary, registerVisible, informationVisible, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id, name = body.name, label = body.label, description = body.description, type = body.type, necessary = body.necessary, registerVisible = body.registerVisible, informationVisible = body.informationVisible, order = body.order;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.infoItemService.updateInfoItem(id, name, label, description, type, necessary, registerVisible, informationVisible, order)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "更新信息项成功" }];
                }
            });
        });
    };
    InfoItemResolver.prototype.deleteInfoItem = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = body.id;
                        if (!id) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.infoItemService.deleteInfoItem(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "删除信息项成功" }];
                }
            });
        });
    };
    InfoItemResolver.prototype.deleteInfoItems = function (req, body) {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ids = body.ids;
                        if (!ids || ids.length === 0) {
                            throw new common_1.HttpException("缺少参数", 400);
                        }
                        return [4 /*yield*/, this.infoItemService.deleteInfoItems(ids)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { code: 200, message: "删除多个信息项成功" }];
                }
            });
        });
    };
    __decorate([
        graphql_1.Mutation("createInfoItem")
    ], InfoItemResolver.prototype, "createInfoItem");
    __decorate([
        graphql_1.Mutation("updateInfoItem")
    ], InfoItemResolver.prototype, "updateInfoItem");
    __decorate([
        graphql_1.Mutation("deleteInfoItem")
    ], InfoItemResolver.prototype, "deleteInfoItem");
    __decorate([
        graphql_1.Mutation("deleteInfoItems")
    ], InfoItemResolver.prototype, "deleteInfoItems");
    InfoItemResolver = __decorate([
        graphql_1.Resolver("InfoItem"),
        common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
        __param(0, common_1.Inject(info_item_service_1.InfoItemService))
    ], InfoItemResolver);
    return InfoItemResolver;
}());
exports.InfoItemResolver = InfoItemResolver;
