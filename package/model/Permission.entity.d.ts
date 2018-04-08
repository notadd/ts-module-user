import { Module } from './Module.entity';
import { User } from './User.entity';
export declare class Permission {
    id: number;
    name: string;
    description: string;
    addUsers: User[];
    reduceUsers: User[];
    moduleToken: string;
    module: Module;
}
