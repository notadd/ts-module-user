import { Module } from "./module.entity";
import { Permission } from "./permission.entity";
export declare class Func {
    id: number;
    name: string;
    permissions: Array<Permission>;
    moduleToken: string;
    module: Module;
}
