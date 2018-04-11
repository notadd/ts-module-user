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
var permission_controller_1 = require("../decorator/permission.controller");
exports.MODULE_TOKEN = "module_token";
var PermissionGuard = /** @class */ (function () {
    function PermissionGuard(userComponent) {
        this.userComponent = userComponent;
    }
    /* 对类、方法上的控制权限进行判断，用来判断请求是否可以通过
       如果类、方法上都有控制权限，必须分别通过，才可通过，也就是and关系
       在类或者方法上，必须通过所有and权限，且通过or权限之一才可通过，也就是顶层关系为and
       class_and1&&class_and2&&(class_or1||class_or2) && method_and1&&method_and2&&(method_or1||method2)
    */
    PermissionGuard.prototype.canActivate = function (req, context) {
        return __awaiter(this, void 0, void 0, function () {
            var parent, handler, auth, user, permissions, class_or, class_and, token, classPass, method_or, method_and, methodPass;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parent = context.parent, handler = context.handler;
                        auth = req.headers["authentication"];
                        user = { id: 1, recycle: false, status: true };
                        if (!user) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userComponent.permissions(user.id)
                            //回收站用户不能访问任何接口
                        ];
                    case 1:
                        //获取用户具有的权限
                        permissions = _a.sent();
                        //回收站用户不能访问任何接口
                        if (user.recycle) {
                            return [2 /*return*/, false];
                        }
                        //封禁用户不具有任何权限
                        if (!user.status) {
                            permissions = [];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        //用户不存在，权限为空
                        permissions = [];
                        _a.label = 3;
                    case 3:
                        class_or = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_OR, parent) || [];
                        class_and = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_AND, parent) || [];
                        token = Reflect.getMetadata(exports.MODULE_TOKEN, parent);
                        classPass = this.checkPermission(permissions, class_and, class_or, token);
                        if (!classPass)
                            return [2 /*return*/, false
                                //获取方法上定义权限
                            ];
                        method_or = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_OR, handler) || [];
                        method_and = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_AND, handler) || [];
                        methodPass = this.checkPermission(permissions, method_and, method_or, token);
                        return [2 /*return*/, methodPass];
                }
            });
        });
    };
    /*  对拥有的权限进行检查，返回是否通过,类检查一次，方法检查一次*/
    PermissionGuard.prototype.checkPermission = function (permissions, and, or, token) {
        var _loop_1 = function (i) {
            var name_1 = and[i];
            //在用户拥有权限中查找
            var find = permissions.find(function (per) {
                //必须名称、token都相同才可以，因为不同模块下权限名可以相同
                return per.name === name_1 && per.moduleToken === token;
            });
            //如果没找到，说明一个and权限未通过
            if (!find) {
                return { value: false };
            }
        };
        //遍历类上and权限，如果不存在，则不进入循环
        for (var i = 0; i < and.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var _loop_2 = function (i) {
            var name_2 = or[i];
            //在用户拥有权限中查找
            var find = permissions.find(function (per) {
                //必须名称、token都相同才可以，因为不同模块下权限名可以相同
                return per.name === name_2 && per.moduleToken === token;
            });
            //如果找到，说明一个or权限通过,退出循环
            if (find) {
                return "break";
            }
            //如果未找到，继续找，如果已经是最后一个or权限还未找到，则返回false
            if (i === or.length - 1) {
                return { value: false };
            }
        };
        //遍历类上or权限，如果有一个通过即通过，如果不存在不进入循环
        for (var i = 0; i < or.length; i++) {
            var state_2 = _loop_2(i);
            if (typeof state_2 === "object")
                return state_2.value;
            if (state_2 === "break")
                break;
        }
        return true;
    };
    PermissionGuard = __decorate([
        common_1.Guard(),
        __param(0, common_1.Inject("UserComponentToken"))
    ], PermissionGuard);
    return PermissionGuard;
}());
exports.PermissionGuard = PermissionGuard;
