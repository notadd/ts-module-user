import { InfoItemService } from '../service/InfoItemService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';


/* 这个几个接口只是写在这，使用上还有很多问题,因为信息项可能不会编辑，所以不一定有用 */
@Resolver('InfoItem')
export class InfoItemResolver {

    constructor(
        @Inject(InfoItemService) private readonly infoItemService: InfoItemService
    ) { }

    @Mutation('createInfoItem')
    async createInfoItem(req: IncomingMessage, body: { name: string, description: string, type: string, necessary: boolean, order: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建信息项成功'
        }
        try {
            let { name, description, type, necessary, order } = body
            if (!name || !type || necessary === undefined || necessary === null) {
                throw new HttpException('缺少参数', 400)
            }
            await this.infoItemService.createInfoItem(name, description, type, necessary, order)
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

    @Mutation('updateInfoItem')
    async updateInfoItem(req: IncomingMessage, body: { id:number,name: string, description: string, type: string, necessary: boolean, order: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '更新信息项成功'
        }
        try {
            let { id ,name, description, type, necessary, order } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.infoItemService.updateInfoItem(id,name, description, type, necessary, order)
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