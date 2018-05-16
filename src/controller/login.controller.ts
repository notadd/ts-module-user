import { Controller, Post, Body, Res, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "../auth/auth.service";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
import * as crypto from "crypto";

@Controller("user")
export class LoginController {

    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    @Post("login")
    async login(@Body() body: { userName: string, password: string }, @Res() res): Promise<void> {
        const { userName, password } = body;
        const user: User | undefined = await this.userRepository.findOne({ userName }, { select: ["id", "userName", "status", "recycle"] });
        if (!user) {
            res.end({ code: 400, message: "指定用户不存在" });
            return;
        }
        /* 回收站用户不可登录 */
        if (user.recycle) {
            res.end({ code: 400, message: "指定用户在回收站中" });
            return;
        }
        /* 封禁用户不可登录 */
        if (!user.status) {
            res.end({ code: 400, message: "指定用户已被封禁" });
            return;
        }
        const passwordWithSalt = crypto.createHash("sha256").update(password + user.salt).digest("hex");
        if (passwordWithSalt !== user.password) {
            res.end({ code: 400, message: "密码不正确" });
            return;
        }
        const token: string = this.authService.createToken(user);
        res.end({ code: 200, message: "登录成功", token });
        return;
    }

}
