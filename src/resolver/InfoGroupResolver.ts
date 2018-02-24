import { InfoGroupsData } from '../interface/infoGroup/InfoGroupsData';
import { InfoItemsData } from '../interface/infoGroup/InfoItemsData';
import { InfoGroupService } from '../service/InfoGroupService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';

@Resolver('InfoGroup')
export class InfoGroupResolver {

    constructor(
        @Inject(InfoGroupService) private readonly infoGroupService: InfoGroupService
    ) { }

    @Query('infoGroups')
    async infoGroups(): Promise<InfoGroupsData> {
        let data: InfoGroupsData = {
            code: 200,
            message: '获取所有信息组成功',
            infoGroups: []
        }
        try {
            data.infoGroups = await this.infoGroupService.getAll()
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

    @Query('infoItems')
    async infoItems(req: IncomingMessage, body: { id: number }): Promise<InfoItemsData> {
        let data: InfoItemsData = {
            code: 200,
            message: '获取指定信息组的信息项成功',
            infoItems: []
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            data.infoItems = await this.infoGroupService.getInfoItems(id)
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

    @Mutation('createInfoGroup')
    async createInfoGroup(req: IncomingMessage, body: { name: string }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建信息组成功'
        }
        try {
            let { name } = body
            if (!name) {
                throw new HttpException('缺少参数', 400)
            }
            await this.infoGroupService.createInfoGroup(name)
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

    @Mutation('updateInfoGroup')
    async updateInfoGroup(req: IncomingMessage, body: { name: string }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '更新信息组成功'
        }
        try {
            let { name } = body
            if (!name) {
                throw new HttpException('缺少参数', 400)
            }
            await this.infoGroupService.updateInfoGroup(name)
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

    @Mutation('deleteInfoGroup')
    async deleteInfoGroup(req: IncomingMessage, body: { id:number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '删除信息组成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.infoGroupService.deleteInfoGroup(id)
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
