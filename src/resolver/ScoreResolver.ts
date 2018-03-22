import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { ScoreService } from '../service/ScoreService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';

@Resolver('Score')
@UseInterceptors(ExceptionInterceptor)
export class ScoreResolver {

    constructor(
        @Inject(ScoreService) private readonly scoreService: ScoreService
    ) { }

    @Query('getScore')
    async getScore(req: IncomingMessage, body: { userId: number, scoreTypeId: number }): Promise<Data & { score: number }> {
        let { userId, scoreTypeId } = body
        if (!userId || !scoreTypeId) {
            throw new HttpException('缺少参数', 400)
        }
        let score = await this.scoreService.getScore(userId, scoreTypeId)
        return { code: 200, message: '获取积分成功', score }
    }

    @Mutation('setScore')
    async setScore(req: IncomingMessage, body: { userId: number, scoreTypeId: number, add: number }): Promise<Data> {
        let { userId, scoreTypeId, add } = body
        if (!userId || !scoreTypeId) {
            throw new HttpException('缺少参数', 400)
        }
        await this.scoreService.setScore(userId, scoreTypeId, add)
        return { code: 200, message: '设置积分成功' }
    }


}