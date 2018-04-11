import { Repository } from "typeorm";
import { Func } from "../model/func.entity";
import { Module } from "../model/module.entity";
import { Role } from "../model/role.entity";
export declare class RoleService {
    private readonly funcRepository;
    private readonly roleRepository;
    private readonly moduleRepository;
    constructor(funcRepository: Repository<Func>, roleRepository: Repository<Role>, moduleRepository: Repository<Module>);
    createRole(moduleToken: string, name: string, score: number): Promise<void>;
    updateRole(id: number, name: string, score: number): Promise<void>;
    deleteRole(id: number): Promise<void>;
    setFuncs(id: number, funcIds: Array<number>): Promise<void>;
}
