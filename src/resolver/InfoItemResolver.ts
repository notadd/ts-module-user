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


}