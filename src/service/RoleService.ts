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
        let module: Module = await this.moduleRepository.findOneById(moduleToken)
        if (!module) {
            throw new HttpException('指定模块token=' + moduleToken + '不存在', 415)
        }
        let exist: Role = await this.roleRepository.findOne({ name, moduleToken })
        if (exist) {
            throw new HttpException('指定模块token=' + moduleToken + '下，指定名称name=' + name + '角色已经存在', 420)
        }
        let role: Role = this.roleRepository.create({ name, score, module })
        try {
            await this.roleRepository.save(role)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateRole(id: number, name: string, score: number): Promise<void> {
        let role: Role = await this.roleRepository.findOneById(id)
        if (!role) {
            throw new HttpException('指定id=' + id + '角色不存在', 421)
        }
        if (name !== role.name) {
            let exist: Role = await this.roleRepository.findOne({ name, moduleToken: role.moduleToken })
            if (exist) {
                throw new HttpException('指定模块token=' + role.moduleToken + '下，指定名称name=' + name + '角色已经存在', 420)
            }
        }
        try {
            role.name = name
            role.score = score
            await this.roleRepository.save(role)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteRole(id: number): Promise<void> {
        let role: Role = await this.roleRepository.findOneById(id)
        if (!role) {
            throw new HttpException('指定id=' + id + '角色不存在', 421)
        }
        try {
            await this.roleRepository.remove(role)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async setFuncs(id: number, funcIds: number[]): Promise<void> {
        let role: Role = await this.roleRepository.findOneById(id)
        if (!role) {
            throw new HttpException('指定id=' + id + '角色不存在', 421)
        }
        let funcs: Func[] = await this.funcRepository.findByIds(funcIds)
        funcIds.forEach(funcId => {
            let find: Func = funcs.find(func => {
                return func.id === funcId
            })
            if (!find) {
                throw new HttpException('指定id=' + funcId + '功能不存在', 422)
            }
            if (find.moduleToken !== role.moduleToken) {
                throw new HttpException('指定角色、功能必须属于同一个模块', 423)
            }
        })
        try {
            role.funcs = funcs
            await this.roleRepository.save(role)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }


}