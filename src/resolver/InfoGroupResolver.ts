import { InfoGroupsData } from '../interface/infoGroup/InfoGroupsData';
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
    async infoGroups():Promise<InfoGroupsData>{
        let data:InfoGroupsData = {
            code:200,
            message:'获取所有信息组成功',
            infoGroups:[]
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


}
