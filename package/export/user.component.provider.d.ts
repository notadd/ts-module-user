import { Permission } from "../model/permission.entity";
import { UserService } from "../service/user.service";
import { Func } from "../model/func.entity";
import { Role } from "../model/role.entity";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
export declare class UserComponent {
    private readonly funcRepository;
    private readonly roleRepository;
    private readonly userRepository;
    private readonly userService;
    constructor(funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>, userService: UserService);
    permissions(id: number): Promise<Array<Permission>>;
    getUserById(id: number): Promise<User | undefined>;
    getUserByName(userName: string): Promise<User | undefined>;
    isExist(user: {
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    }): Promise<boolean>;
    createUser(organizationId: number, userName: string, password: string): Promise<void>;
    updateUser(id: number, userName: string, password: string): Promise<void>;
    setRoles(id: number, roleIds: Array<number>): Promise<void>;
    setPermissions(id: number, permissionIds: Array<number>): Promise<void>;
}
export declare const UserComponentToken = "UserComponentToken";
export declare const UserComponentProvider: {
    provide: string;
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>, userService: UserService) => UserComponent;
    inject: (string | typeof UserService)[];
};
