import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Inject, HttpException } from '@nestjs/common';
import { RoleService } from '../service/RoleService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Role } from '../model/Role';


/* 角色是功能的集合，因为功能属于模块，则角色也属于某个模块，随着模块删除而删除 */
@Resolver('Role')
export class RoleResolver {

    constructor(
        @Inject(RoleService) private readonly roleService: RoleService
    ) { }
}