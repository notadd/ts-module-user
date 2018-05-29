import { User } from "../model/user.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private readonly usersRepository;
    secretKey: string;
    expiresIn: number;
    constructor(usersRepository: Repository<User>);
    createToken(user: any): any;
    validateUser(user: User): Promise<boolean | User>;
}
