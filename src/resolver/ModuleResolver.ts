import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { ModuleService } from '../service/ModuleService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';


/* 模块，代表了初始化时遍历发现的具有权限、角色的模块，可以包含权限、功能、角色，模块删除时，相应的权限、角色、功能也会被删除 */
@Resolver('Module')
export class ModuleResolver {

    constructor(
        @Inject(ModuleService) private readonly moduleService: ModuleService
    ) { }


}