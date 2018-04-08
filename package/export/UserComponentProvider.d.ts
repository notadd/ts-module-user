import { Repository } from 'typeorm';
import { Func } from '../model/Func.entity';
import { Permission } from '../model/Permission.entity';
import { Role } from '../model/Role.entity';
import { User } from '../model/User.entity';
export declare class UserComponent {
    private readonly funcRepository;
    private readonly roleRepository;
    private readonly userRepository;
    constructor(funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>);
    permissions(id: number): Promise<Permission[]>;
    login(userName: string, password: string): Promise<boolean | User>;
    getUser(id: number): Promise<{
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    }>;
    isExist(user: {
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    }): Promise<boolean>;
}
export declare const UserComponentProvider: {
    provide: string;
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>) => UserComponent;
    inject: string[];
};
