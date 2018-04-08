import { Func } from './Func.entity';
import { Module } from './Module.entity';
import { User } from './User.entity';
export declare class Role {
    id: number;
    name: string;
    score: number;
    funcs: Func[];
    moduleToken: string;
    module: Module;
    users: User[];
}
