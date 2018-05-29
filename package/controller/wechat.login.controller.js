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
const http_exception_filter_1 = require("../filter/http.exception.filter");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const http_util_1 = require("../util/http.util");
const user_entity_1 = require("../model/user.entity");
const typeorm_2 = require("typeorm");
let WechatLoginController = class WechatLoginController {
    constructor(httpUtil, authService, userRepository) {
        this.httpUtil = httpUtil;
        this.authService = authService;
        this.userRepository = userRepository;
        this.oauthUrl = "https://api.weixin.qq.com/sns";
        this.appid = "wx2dd40b5b1c24a960";
        this.secret = "H14bEjt0IjT6p8MW76p9q0HYuhyFS1HV";
        this.tokenMap = new Map();
    }
    wechatLogin(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = body;
            if (!code) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const { openid, access_token, refresh_token } = yield this.getAccessToken(this.appid, this.secret, code);
            this.tokenMap.set(openid, { access_token, refresh_token });
            let user = yield this.userRepository.findOne({ userName: openid }, { select: ["id", "userName", "status", "recycle"] });
            if (!user) {
                const newUser = this.userRepository.create({ userName: openid, status: true, recycle: false });
                user = yield this.userRepository.save(newUser);
            }
            const token = this.authService.createToken(user);
            res.end({ code: 200, message: "微信用户登录成功", openid, token });
            return;
        });
    }
    getAccessToken(appid, secret, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                baseUrl: this.oauthUrl,
                qs: {
                    appid,
                    secret,
                    code,
                    grant_type: "authorization_code"
                }
            };
            const result = yield this.httpUtil.wechatOauthGet("/oauth2/access_token", options);
            return result;
        });
    }
    getUserInfo(accessToken, openid) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                baseUrl: this.oauthUrl,
                qs: {
                    access_token: accessToken,
                    openid,
                    lang: "zh_CN"
                }
            };
            const result = yield this.httpUtil.wechatOauthGet("/userinfo", options);
            return result;
        });
    }
};
__decorate([
    common_1.Post("login"),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatLoginController.prototype, "wechatLogin", null);
WechatLoginController = __decorate([
    common_1.Controller("user/wechat"),
    common_1.UseFilters(new http_exception_filter_1.HttpExceptionFilter()),
    __param(0, common_1.Inject(http_util_1.HttpUtil)),
    __param(1, common_1.Inject(auth_service_1.AuthService)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [http_util_1.HttpUtil,
        auth_service_1.AuthService,
        typeorm_2.Repository])
], WechatLoginController);
exports.WechatLoginController = WechatLoginController;

//# sourceMappingURL=wechat.login.controller.js.map
