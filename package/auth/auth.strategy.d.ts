import { AuthService } from "./auth.service";
import { User } from "../model/user.entity";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: User, done: Function): Promise<any>;
}
