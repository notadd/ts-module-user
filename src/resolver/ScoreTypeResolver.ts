import { HttpException, Inject, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Data } from '../interface/Data';
import { ScoreTypesData } from '../interface/scoreType/ScoreTypesData';
import { ScoreTypeService } from '../service/ScoreTypeService';

@Resolver('ScoreType')
@UseInterceptors(ExceptionInterceptor)
export class ScoreTypeResolver {

    constructor(
        @Inject(ScoreTypeService) private readonly scoreTypeService: ScoreTypeService
    ) {
    }

    @Query('scoreTypes')
    async scoreTypes(): Promise<ScoreTypesData> {
        let scoreTypes = await this.scoreTypeService.getAll()
        return { code: 200, message: '获取所有积分类型成功', scoreTypes }
    }

    @Mutation('createScoreType')
    async createScoreType(req: IncomingMessage, body: { name: string, type: string, description: string }): Promise<Data> {
        let { name, type, description } = body
        if (!name || !type) {
            throw new HttpException('缺少参数', 400)
        }
        if (type !== 'float' && type !== 'int') {
            throw new HttpException('参数错误', 400)
        }
        await this.scoreTypeService.createScoreType(name, type, description)
        return { code: 200, message: '创建积分类型成功' }
    }

    @Mutation('updateScoreType')
    async updateScoreType(req: IncomingMessage, body: { id: number, name: string, type: string, description: string }): Promise<Data> {
        let { id, name, type, description } = body
        if (!id || !name || !type) {
            throw new HttpException('缺少参数', 400)
        }
        if (type !== 'float' && type !== 'int') {
            throw new HttpException('参数错误', 400)
        }
        await this.scoreTypeService.updateScoreType(id, name, type, description)
        return { code: 200, message: '更新积分类型成功' }
    }

    /* 删除积分类型时，相关积分会被一起删除 */
    @Mutation('deleteScoreType')
    async deleteScoreType(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.scoreTypeService.deleteScoreType(id)
        return { code: 200, message: '删除积分类型成功' }
    }

    /* 批量删除积分类型，删除积分类型时，相关积分会被一起删除 */
    @Mutation('deleteScoreTypes')
    async deleteScoreTypes(req: IncomingMessage, body: { ids: number[] }): Promise<Data> {
        let { ids } = body
        if (!ids || ids.length === 0) {
            throw new HttpException('缺少参数', 400)
        }
        await this.scoreTypeService.deleteScoreTypes(ids)
        return { code: 200, message: '批量删除积分类型成功' }
    }

}
