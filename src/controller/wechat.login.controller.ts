import { AccessTokenResponse } from "../interface/wechat/access.token.response";
import { Controller, Post, Body, Res, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "../auth/auth.service";
import { HttpUtil } from "../util/http.util";
import { User } from "../model/user.entity";
import { get, CoreOptions } from "request";
import { Repository } from "typeorm";
import * as qs from "qs";


@Controller("user")
export class WechatLoginController {

    private readonly oauthUrl: string = "https://api.weixin.qq.com/sns"
    private appid: string = "wx6926e1be948987ee";
    private secret: string = "dda8c56d735078160ac6724911100497";
    private readonly tokenMap: Map<string, { access_token: string, refresh_token: string }> = new Map();

    constructor(
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
        @Inject(AuthService) private readonly authService: AuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    @Post("wechat/login")
    async wechatLogin( @Body() body: { code: string }, @Res() res): Promise<void> {
        const { code } = body;
        if (!code) {
            res.end({ code: 400, message: "缺少参数" });
            return;
        }
        const { openid, access_token, refresh_token }: AccessTokenResponse = await this.getAccessToken(this.appid, this.secret, code);
        this.tokenMap.set(openid, { access_token, refresh_token });

        let user: User | undefined = await this.userRepository.findOne({ userName: openid });


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
        }
        const result = await this.httpUtil.wechatOauthGet("/oauth2/access_token", options);
        return result;
    }

    async getUserInfo(access_token: string, openid: string): Promise<any> {
        const options: CoreOptions = {
            baseUrl: this.oauthUrl,
            qs: {
                access_token,
                openid,
                lang: "zh_CN"
            }
        }
        const result = await this.httpUtil.wechatOauthGet("/userinfo", options);
        return result;
    }

}