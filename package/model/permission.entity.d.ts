import { Module } from "./module.entity";
import { User } from "./user.entity";
export declare class Permission {
    id: number;
    name: string;
    description: string;
    addUsers: Array<User>;
    reduceUsers: Array<User>;
    moduleToken: string;
    module: Module;
}
