import { Repository } from "typeorm";
import { Module } from "../model/module.entity";
export declare class ModuleService {
    private readonly moduleRepository;
    constructor(moduleRepository: Repository<Module>);
    getAll(): Promise<Array<Module>>;
}
