import { Repository } from 'typeorm';
import { Func } from '../model/Func.entity';
import { Module } from '../model/Module.entity';
import { Permission } from '../model/Permission.entity';
export declare class FuncService {
    private readonly funcRepository;
    private readonly moduleRepository;
    private readonly permissionRepository;
    constructor(funcRepository: Repository<Func>, moduleRepository: Repository<Module>, permissionRepository: Repository<Permission>);
    createFunc(moduleToken: string, name: string): Promise<void>;
    updateFunc(id: number, name: string): Promise<void>;
    deleteFunc(id: number): Promise<void>;
    setPermissions(id: number, permissionIds: number[]): Promise<void>;
}
