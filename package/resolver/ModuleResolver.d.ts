import { ModulesData } from '../interface/module/ModulesData';
import { ModuleService } from '../service/ModuleService';
export declare class ModuleResolver {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    modules(): Promise<ModulesData>;
}
