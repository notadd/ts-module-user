import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "../model/user.entity";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";

/* 认证服务组件，具有创建token、验证有效载荷的作用 */
@Injectable()
export class AuthService {

    /* 密钥、超时可配置 */
    secretKey = "secretKey";
    expiresIn = 3600;

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) { }

    /* 使用有效载荷(用户对象)，创建jsonwebtoken */
    createToken(user: any) {
        user.__proto__ = undefined;
        /* 默认的密钥 */
        return jwt.sign(user, this.secretKey, { expiresIn: this.expiresIn });
    }

    /*
    验证有效载荷方法，这一步时，passport已经将token解密，还原出了生成token的有效载荷
    而且此时，到这一步，说明解密成功，没有超时，这里只需要加入验证有效载荷的逻辑
     */
    async validateUser(user: User): Promise<boolean | User> {
        const exist: User | undefined = await this.usersRepository.findOne(user.id, { select: ["id", "userName", "status", "recycle"] });
        /* 如果指定用户不存在、禁用、在回收站中，则验证不通过 */
        if (!exist || !exist.status || exist.recycle) {
            return false;
        }
        return exist;
    }
}
