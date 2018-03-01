import { ScoreTypesData } from '../interface/scoreType/ScoreTypesData';
import { ScoreTypeService } from '../service/ScoreTypeService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';

@Resolver('ScoreType')
export class ScoreTypeResolver {

    constructor(
        @Inject(ScoreTypeService) private readonly scoreTypeService: ScoreTypeService
    ) { }

    @Query('scoreTypes')
    async scoreTypes(): Promise<ScoreTypesData> {
        let data: ScoreTypesData = {
            code: 200,
            message: '获取所有积分类型成功',
            scoreTypes: []
        }
        try {
            data.scoreTypes = await this.scoreTypeService.getAll()
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