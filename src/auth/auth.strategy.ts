import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "../model/user.entity";

/*
认证策略，这里使用的是jsonwebtoken
JwtStrategy继承了PassportStrategy类，这个类构造函数中，保证passport采用这个策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    /* 调用父类构造函数，使passport采用本策略 */
    super({
      /* token的获取方式，这里指的是从authorization请求头中获取`bearer ${token}`形式的token */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authService.secretKey,
      // issuer?: string;
      // audience?: string;
      // algorithms?: string[];
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  /* passport直接使用的是这个验证函数，这个验证函数里面调用了AuthService里的验证函数 */
  async validate(payload: User, done: Function) {
    /* 调用AuthService里的验证函数 */
    const user = await this.authService.validateUser(payload);
    /* 如果不存在，即返回false，则将异常传递给回调 */
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    /* 如果存在将认证后的user返回给回调 */
    done(null, user);
  }
}
