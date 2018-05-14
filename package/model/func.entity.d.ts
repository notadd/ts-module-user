import { Permission } from "./permission.entity";
import { Module } from "./module.entity";
export declare class Func {
    id: number;
    name: string;
    permissions: Array<Permission>;
    moduleToken: string;
    module: Module;
}
