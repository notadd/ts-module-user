import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { ScoreService } from '../service/ScoreService';
import { Inject, HttpException } from '@nestjs/common';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';

@Resolver('Score')
export class ScoreResolver {

    constructor(
        @Inject(ScoreService) private readonly scoreService: ScoreService
    ) { }

    @Query('getScore')
    async getScore(req: IncomingMessage, body: { userId: number, scoreTypeId: number }): Promise<Data & { score: number }> {
        let data: Data & { score: number } = {
            code: 200,
            message: '获取积分成功',
            score: null
        }
        try {
            let { userId, scoreTypeId } = body
            if (!userId || !scoreTypeId) {
                throw new HttpException('缺少参数', 400)
            }
            data.score = await this.scoreService.getScore(userId, scoreTypeId)
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

    @Mutation('setScore')
    async setScore(req: IncomingMessage, body: { userId: number, scoreTypeId: number, add: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '设置积分成功'
        }
        try {
            let { userId, scoreTypeId, add } = body
            if (!userId || !scoreTypeId) {
                throw new HttpException('缺少参数', 400)
            }
            await this.scoreService.setScore(userId, scoreTypeId, add)
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