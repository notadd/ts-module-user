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


}
