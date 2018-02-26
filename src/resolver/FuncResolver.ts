import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { FuncService } from '../service/FuncService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';


/* 功能是权限的集合，且只能包含一个模块下的权限，所以功能也属于某个模块 */
@Resolver('Func')
export class FuncResolver {

    constructor(
        @Inject(FuncService) private readonly funcService: FuncService
    ) { }

}