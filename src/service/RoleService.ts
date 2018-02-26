import { Component, Inject, HttpException } from '@nestjs/common';
import { Module } from '../model/Module';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Role } from '../model/Role';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class RoleService {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.RoleRepository') private readonly roleRepository: Repository<Role>,
        @Inject('UserPMModule.ModuleRepository') private readonly moduleRepository: Repository<Module>
    ) { }

    async createRole(moduleToken: string, name: string, score: number): Promise<void> {
        let module:Module = await this.moduleRepository.findOneById(moduleToken)
        if(!module){
            throw new HttpException('指定模块token='+moduleToken+'不存在',415)
        }
        let exist: Role = await this.roleRepository.findOne({ name,moduleToken })
        if (exist) {
            throw new HttpException('指定模块token='+moduleToken+'下，指定名称name=' + name + '角色已经存在', 420)
        }
        let role: Role = this.roleRepository.create({ name, score,module })
        try {
            await this.roleRepository.save(role)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

}