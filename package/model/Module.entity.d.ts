import { Func } from './Func.entity';
import { Permission } from './Permission.entity';
import { Role } from './Role.entity';
export declare class Module {
    token: string;
    permissions: Permission[];
    funcs: Func[];
    roles: Role[];
}
