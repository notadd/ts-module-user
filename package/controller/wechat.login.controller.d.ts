import { AccessTokenResponse } from "../interface/wechat/access.token.response";
import { AuthService } from "../auth/auth.service";
import { HttpUtil } from "../util/http.util";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
export declare class WechatLoginController {
    private readonly httpUtil;
    private readonly authService;
    private readonly userRepository;
    private readonly oauthUrl;
    private appid;
    private secret;
    private readonly tokenMap;
    constructor(httpUtil: HttpUtil, authService: AuthService, userRepository: Repository<User>);
    wechatLogin(body: {
        code: string;
    }, res: any): Promise<void>;
    getAccessToken(appid: string, secret: string, code: string): Promise<AccessTokenResponse>;
    getUserInfo(accessToken: string, openid: string): Promise<any>;
}
