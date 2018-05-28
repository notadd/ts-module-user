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
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const user_entity_1 = require("../model/user.entity");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
let LoginController = class LoginController {
    constructor(authService, userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }
    login(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, password } = body;
            const user = yield this.userRepository.findOne({ userName }, {
                select: ["id", "userName", "password", "status", "recycle"]
            });
            if (!user) {
                res.end({ code: 400, message: "指定用户不存在" });
                return;
            }
            if (user.recycle) {
                res.end({ code: 400, message: "指定用户在回收站中" });
                return;
            }
            if (!user.status) {
                res.end({ code: 400, message: "指定用户已被封禁" });
                return;
            }
            const passwordWithSalt = crypto.createHash("sha256").update(password + user.salt).digest("hex");
            if (passwordWithSalt !== user.password) {
                res.end({ code: 400, message: "密码不正确" });
                return;
            }
            delete user.password;
            const token = this.authService.createToken(user);
            res.end({ code: 200, message: "登录成功，返回token", token });
            return;
        });
    }
};
__decorate([
    common_1.Post("login"),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
LoginController = __decorate([
    common_1.Controller("user"),
    __param(0, common_1.Inject(auth_service_1.AuthService)),
    __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_2.Repository])
], LoginController);
exports.LoginController = LoginController;

//# sourceMappingURL=login.controller.js.map
