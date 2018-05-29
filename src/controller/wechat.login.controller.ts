import { Controller, Post, Body, Res, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "../auth/auth.service";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
import * as qs from "qs";


@Controller("user")
export class LoginController {

    private readonly oauthAccessTokenUrl: string = "https://api.weixin.qq.com/sns/oauth2/access_token?"
    private appid: string = "wx6926e1be948987ee";
    private secret: string = "dda8c56d735078160ac6724911100497";
    private readonly tokenMap: Map<string, { access_token: string, refresh_token: string }> = new Map();

    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    @Post("wechat/login")
    async wechatLogin( @Body() body: { code: string }, @Res() res): Promise<void> {

    }

    async getAccessToken(appid: string, secret: string, code: string): Promise<string>

}