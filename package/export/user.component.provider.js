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
var typeorm_1 = require("@nestjs/typeorm");
var crypto = require("crypto");
var func_entity_1 = require("../model/func.entity");
var role_entity_1 = require("../model/role.entity");
var user_entity_1 = require("../model/user.entity");
var UserComponent = /** @class */ (function () {
    function UserComponent(funcRepository, roleRepository, userRepository) {
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }
    UserComponent.prototype.permissions = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, result, temp, ids, i, role, j, func;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { relations: ["roles", "adds", "reduces"] })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, []];
                        }
                        result = [];
                        temp = [];
                        ids = new Set();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < user.roles.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.roleRepository.findOneById(user.roles[i].id, { relations: ["funcs"] })];
                    case 3:
                        role = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < role.funcs.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.funcRepository.findOneById(role.funcs[i].id, { relations: ["permissions"] })];
                    case 5:
                        func = _a.sent();
                        temp = temp.concat(func.permissions);
                        _a.label = 6;
                    case 6:
                        j++;
                        return [3 /*break*/, 4];
                    case 7:
                        i++;
                        return [3 /*break*/, 2];
                    case 8:
                        //生成去重的集合
                        temp.forEach(function (per) {
                            if (!ids.has(per.id)) {
                                ids.add(per.id);
                                result.push(per);
                            }
                        });
                        //遍历添加权限
                        user.adds.forEach(function (per) {
                            if (!ids.has(per.id)) {
                                ids.add(per.id);
                                result.push(per);
                            }
                        });
                        //遍历减去权限
                        user.reduces.forEach(function (per) {
                            if (ids.has(per.id)) {
                                ids["delete"](per.id);
                                var index = result.findIndex(function (p) {
                                    return p.id === per.id;
                                });
                                result.splice(index, 1);
                            }
                        });
                        result.sort(function (a, b) {
                            return a.id - b.id;
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /* 用户登录方法，登录用户要求用户名与密码匹配，用户密码为加盐生成
       回收站用户不能登录
       封禁用户可以登录但是没有权限
    */
    UserComponent.prototype.login = function (userName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, passwordWithSalt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ userName: userName })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, false];
                        }
                        /* 回收站用户不可登录 */
                        if (user.recycle) {
                            return [2 /*return*/, false];
                        }
                        passwordWithSalt = crypto.createHash("md5").update(password + user.salt).digest("hex");
                        if (passwordWithSalt !== user.password) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.userRepository.findOneById(user.id, { select: ["id", "userName", "status", "recycle"] })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserComponent.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneById(id, { select: ["id", "userName", "status", "recycle"] })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserComponent.prototype.isExist = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var exist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne(user)];
                    case 1:
                        exist = _a.sent();
                        return [2 /*return*/, !!exist];
                }
            });
        });
    };
    UserComponent = __decorate([
        __param(0, typeorm_1.InjectRepository(func_entity_1.Func)),
        __param(1, typeorm_1.InjectRepository(role_entity_1.Role)),
        __param(2, typeorm_1.InjectRepository(user_entity_1.User))
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
exports.UserComponentProvider = {
    provide: "UserComponentToken",
    useFactory: function (funcRepository, roleRepository, userRepository) {
        return new UserComponent(funcRepository, roleRepository, userRepository);
    },
    inject: ["FuncRepository", "RoleRepository", "UserRepository"]
};
