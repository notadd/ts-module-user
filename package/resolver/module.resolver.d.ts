import { ModulesData } from "../interface/module/modules.data";
import { ModuleService } from "../service/module.service";
export declare class ModuleResolver {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    modules(): Promise<ModulesData>;
}
