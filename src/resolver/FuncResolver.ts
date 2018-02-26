import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { FuncService } from '../service/FuncService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';


/* 功能是权限的集合，且只能包含一个模块下的权限，所以功能也属于某个模块 */
@Resolver('Func')
export class FuncResolver {

    constructor(
        @Inject(FuncService) private readonly funcService: FuncService
    ) { }

    @Mutation('createFunc')
    async createFunc(req: IncomingMessage, body: { name: string }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建功能成功'
        }
        try {
            let { name } = body
            if (!name) {
                throw new HttpException('缺少参数', 400)
            }
            await this.funcService.createFunc(name)
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

    @Mutation('updateFunc')
    async updateFunc(req: IncomingMessage, body: { id: number, name: string }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '更新功能成功'
        }
        try {
            let { id, name } = body
            if (!id || !name) {
                throw new HttpException('缺少参数', 400)
            }
            await this.funcService.updateFunc(id, name)
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

    @Mutation('deleteFunc')
    async deleteFunc(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '删除功能成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.funcService.deleteFunc(id)
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

    @Mutation('addPermission')
    async addPermission(req: IncomingMessage, body: { id: number, permissionId: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '添加权限成功'
        }
        try {
            let { id, permissionId } = body
            if (!id || !permissionId) {
                throw new HttpException('缺少参数', 400)
            }
            await this.funcService.addPermission(id, permissionId)
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