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
    async createRole(req: IncomingMessage, body: { name: string, score: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建角色成功'
        }
        try {
            let { name, score } = body
            if (!name || !score) {
                throw new HttpException('缺少参数', 400)
            }
            await this.roleService.createRole(name, score)
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