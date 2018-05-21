import { AuthService } from "../auth/auth.service";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
export declare class LoginController {
    private readonly authService;
    private readonly userRepository;
    constructor(authService: AuthService, userRepository: Repository<User>);
    login(body: {
        userName: string;
        password: string;
    }, res: any): Promise<void>;
}
