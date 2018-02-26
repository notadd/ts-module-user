import { Component, Inject, HttpException } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Role } from '../model/Role';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class RoleService {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.RoleRepository') private readonly roleRepository: Repository<Role>
    ) { }

    async createRole(name:string,score:number):Promise<void>{
        let exist:Role  = await this.roleRepository.findOne({name})
        if(exist){
            throw new HttpException('指定名称name='+name+'角色已经存在',420)
        }
        let role:Role = this.roleRepository.create({name,score})
    }

}