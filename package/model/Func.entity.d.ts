import { Module } from './Module.entity';
import { Permission } from './Permission.entity';
export declare class Func {
    id: number;
    name: string;
    permissions: Permission[];
    moduleToken: string;
    module: Module;
}
