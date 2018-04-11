import { Func } from "./func.entity";
import { Module } from "./module.entity";
import { User } from "./user.entity";
export declare class Role {
    id: number;
    name: string;
    score: number;
    funcs: Array<Func>;
    moduleToken: string;
    module: Module;
    users: Array<User>;
}
