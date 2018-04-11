import { Func } from "./func.entity";
import { Permission } from "./permission.entity";
import { Role } from "./role.entity";
export declare class Module {
    token: string;
    permissions: Array<Permission>;
    funcs: Array<Func>;
    roles: Array<Role>;
}
