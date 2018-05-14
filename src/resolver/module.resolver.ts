import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { ModulesData } from "../interface/module/modules.data";
import { ModuleService } from "../service/module.service";
import { Inject, UseInterceptors } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

/* 模块，代表了初始化时遍历发现的具有权限、角色的模块，可以包含权限、功能、角色，模块删除时，相应的权限、角色、功能也会被删除 */
@Resolver("Module")
@UseInterceptors(ExceptionInterceptor)
export class ModuleResolver {

    constructor(
        @Inject(ModuleService) private readonly moduleService: ModuleService
    ) { }

    @Query("modules")
    async modules(): Promise<ModulesData> {
        const modules = await this.moduleService.getAll();
        return { code: 200, message: "获取模块信息成功", modules };
    }
}
