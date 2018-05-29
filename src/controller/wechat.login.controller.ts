import { AccessTokenResponse } from "../interface/wechat/access.token.response";
import { Controller, Post, Body, Res, Inject, UseFilters, HttpException } from "@nestjs/common";
import { HttpExceptionFilter } from "../filter/http.exception.filter";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "../auth/auth.service";
import { HttpUtil } from "../util/http.util";
import { User } from "../model/user.entity";
import { get, CoreOptions } from "request";
import { Repository } from "typeorm";
import * as qs from "qs";

@Controller("user/wechat")
@UseFilters(new HttpExceptionFilter())
export class WechatLoginController {

    private readonly oauthUrl: string = "https://api.weixin.qq.com/sns";
    private appid = "wx2dd40b5b1c24a960";
    private secret = "H14bEjt0IjT6p8MW76p9q0HYuhyFS1HV";
    private readonly tokenMap: Map<string, { access_token: string, refresh_token: string }> = new Map();

    constructor(
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
        @Inject(AuthService) private readonly authService: AuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    @Post("login")
    async wechatLogin(@Body() body: { code: string }, @Res() res): Promise<void> {
        const { code } = body;
        if (!code) {
            throw new HttpException("缺少参数", 400);
        }
        const { openid, access_token, refresh_token }: AccessTokenResponse = await this.getAccessToken(this.appid, this.secret, code);
        this.tokenMap.set(openid, { access_token, refresh_token });
        let user: User | undefined = await this.userRepository.findOne({ userName: openid }, { select: ["id", "userName", "status", "recycle"] });
        if (!user) {
            const newUser: User = this.userRepository.create({ userName: openid, status: true, recycle: false });
            user = await this.userRepository.save(newUser);
        }
        const token: string = this.authService.createToken(user);
        res.json({ code: 200, message: "微信用户登录成功", openid, token });
        res.end()
        return;
    }

    async getAccessToken(appid: string, secret: string, code: string): Promise<AccessTokenResponse> {
        const options: CoreOptions = {
            baseUrl: this.oauthUrl,
            qs: {
                appid,
                secret,
                code,
                grant_type: "authorization_code"
            }
        };
        const result = await this.httpUtil.wechatOauthGet("/oauth2/access_token", options);
        return result;
    }

    async getUserInfo(accessToken: string, openid: string): Promise<any> {
        const options: CoreOptions = {
            baseUrl: this.oauthUrl,
            qs: {
                access_token: accessToken,
                openid,
                lang: "zh_CN"
            }
        };
        const result = await this.httpUtil.wechatOauthGet("/userinfo", options);
        return result;
    }

}
