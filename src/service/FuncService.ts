import { Component, Inject, HttpException } from '@nestjs/common';
import { Permission } from '../model/Permission';
import { Module } from '../model/Module';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class FuncService {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.ModuleRepository') private readonly moduleRepository: Repository<Module>,
        @Inject('UserPMModule.PermissionRepository') private readonly permissionRepository: Repository<Permission>
    ) { }

    async createFunc(moduleToken,name: string): Promise<void> {
        let module:Module = await this.moduleRepository.findOneById(moduleToken)
        if(!module){
            throw new HttpException('指定模块token='+moduleToken+'不存在',415)
        }
        let exist: Func = await this.funcRepository.findOne({ name,moduleToken })
        if (exist) {
            throw new HttpException('指定模块token='+moduleToken+'下，指定名称name=' + name + '功能已经存在', 416)
        }
        let func: Func = this.funcRepository.create({ name ,module})
        try {
            await this.funcRepository.save(func)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateFunc(id: number, name: string): Promise<void> {
        let func: Func = await this.funcRepository.findOneById(id)
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 417)
        }
        if(name!==func.name){
            let exist: Func = await this.funcRepository.findOne({ name,moduleToken:func.moduleToken })
            if (exist) {
                throw new HttpException('指定模块token='+func.moduleToken+'下，指定名称name=' + name + '功能已经存在', 416)
            }
            try {
                func.name = name
                await this.funcRepository.save(func)
            } catch (err) {
                throw new HttpException('数据库错误' + err.toString(), 401)
            }
        }
    }

    async deleteFunc(id: number): Promise<void> {
        let func: Func = await this.funcRepository.findOneById(id)
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 417)
        }
        try {
            await this.funcRepository.removeById(id)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }


    async setPermissions(id: number, permissionIds: number[]): Promise<void> {
        let func: Func = await this.funcRepository.findOneById(id, { relations: ['permissions'] })
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 417)
        }
        let pers: Permission[] = await this.permissionRepository.findByIds(permissionIds, { relations: ['module'] })
        //检查是否所有指定权限都存在
        permissionIds.forEach(permissionId => {
            let find: Permission = pers.find(per => {
                return per.id === permissionId
            })
            if (!find) {
                throw new HttpException('指定id=' + permissionId + '权限不存在', 418)
            }
            if(find.moduleToken!==func.moduleToken){
                throw new HttpException('指定功能、权限只能属于同一个模块', 419)
            }
        })
        try {
            func.permissions = pers
            await this.funcRepository.save(func)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}