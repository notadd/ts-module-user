import { HttpException, Inject, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Data } from '../interface/Data';
import { ScoreService } from '../service/ScoreService';

@Resolver('Score')
@UseInterceptors(ExceptionInterceptor)
export class ScoreResolver {

    constructor(
        @Inject(ScoreService) private readonly scoreService: ScoreService
    ) {
    }

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
