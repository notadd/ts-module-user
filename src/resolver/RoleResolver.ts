import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { RoleService } from '../service/RoleService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Role } from '../model/Role';


/* 角色是功能的集合，因为功能属于模块，则角色也属于某个模块，随着模块删除而删除 */
@Resolver('Role')
export class RoleResolver {

    constructor(
        @Inject(RoleService) private readonly roleService: RoleService
    ) { }

    @Mutation('createRole')
    async createRole(req: IncomingMessage, body: { moduleToken: string, name: string, score: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建角色成功'
        }
        try {
            let { moduleToken, name, score } = body
            if (!moduleToken || !name || !score) {
                throw new HttpException('缺少参数', 400)
            }
            await this.roleService.createRole(moduleToken, name, score)
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

    @Mutation('updateRole')
    async updateRole(req: IncomingMessage, body: { id: number, name: string, score: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '更新角色成功'
        }
        try {
            let { id, name, score } = body
            if (!id || !name || !score) {
                throw new HttpException('缺少参数', 400)
            }
            await this.roleService.updateRole(id, name, score)
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

    @Mutation('deleteRole')
    async deleteRole(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '删除角色成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.roleService.deleteRole(id)
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