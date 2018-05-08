import { Permission } from "../model/permission.entity";
import { Func } from "../model/func.entity";
import { Role } from "../model/role.entity";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
export declare class UserComponent {
    private readonly funcRepository;
    private readonly roleRepository;
    private readonly userRepository;
    constructor(funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>);
    permissions(id: number): Promise<Array<Permission>>;
    login(userName: string, password: string): Promise<boolean | User | undefined>;
    getUserById(id: number): Promise<User | undefined>;
    getUserByName(userName: string): Promise<User | undefined>;
    isExist(user: {
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    }): Promise<boolean>;
}
export declare const UserComponentToken = "UserComponentToken";
export declare const UserComponentProvider: {
    provide: string;
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>) => UserComponent;
    inject: string[];
};
