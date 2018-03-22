import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { RoleService } from '../service/RoleService';
import { Func } from '../model/Func.entity';
import { Role } from '../model/Role.entity';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';



/* 角色是功能的集合，因为功能属于模块，则角色也属于某个模块，随着模块删除而删除 */
@Resolver('Role')
@UseInterceptors(ExceptionInterceptor)
export class RoleResolver {

    constructor(
        @Inject(RoleService) private readonly roleService: RoleService
    ) { }

    @Mutation('createRole')
    async createRole(req: IncomingMessage, body: { moduleToken: string, name: string, score: number }): Promise<Data> {
        let { moduleToken, name, score } = body
        if (!moduleToken || !name || !score) {
            throw new HttpException('缺少参数', 400)
        }
        await this.roleService.createRole(moduleToken, name, score)
        return { code: 200, message: '创建角色成功' }
    }

    @Mutation('updateRole')
    async updateRole(req: IncomingMessage, body: { id: number, name: string, score: number }): Promise<Data> {
        let { id, name, score } = body
        if (!id || !name || !score) {
            throw new HttpException('缺少参数', 400)
        }
        await this.roleService.updateRole(id, name, score)
        return { code: 200, message: '更新角色成功' }
    }

    @Mutation('deleteRole')
    async deleteRole(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.roleService.deleteRole(id)
        return { code: 200, message: '删除角色成功' }
    }

    @Mutation('setFuncs')
    async setFuncs(req: IncomingMessage, body: { id: number, funcIds: number[] }): Promise<Data> {
        let { id, funcIds } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.roleService.setFuncs(id, funcIds)
        return { code: 200, message: '设置角色功能成功' }
    }
}