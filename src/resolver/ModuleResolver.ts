import { ModulesData } from '../interface/module/ModulesData';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { ModuleService } from '../service/ModuleService';
import { Inject, HttpException } from '@nestjs/common';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';


/* 模块，代表了初始化时遍历发现的具有权限、角色的模块，可以包含权限、功能、角色，模块删除时，相应的权限、角色、功能也会被删除 */
@Resolver('Module')
export class ModuleResolver {

    constructor(
        @Inject(ModuleService) private readonly moduleService: ModuleService
    ) { }

    @Query('modules')
    async modules(): Promise<ModulesData> {
        let data: ModulesData = {
            code: 200,
            message: '获取模块信息成功',
            modules: []
        }
        try {
            data.modules = await this.moduleService.getAll()
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }


}