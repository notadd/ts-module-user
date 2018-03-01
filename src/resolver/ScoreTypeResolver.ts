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

}