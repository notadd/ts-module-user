import { Component, Inject, HttpException } from '@nestjs/common';
import { Permission } from '../model/Permission';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class FuncService {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.PermissionRepository') private readonly permissionRepository: Repository<Permission>
    ) { }

    async createFunc(name: string): Promise<void> {
        let exist: Func = await this.funcRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定名称name=' + name + '功能已经存在', 415)
        }
        let func: Func = this.funcRepository.create({ name })
        try {
            await this.funcRepository.save(func)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateFunc(id: number, name: string): Promise<void> {
        let exist: Func = await this.funcRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定名称name=' + name + '功能已经存在', 415)
        }
        let func: Func = await this.funcRepository.findOneById(id)
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 416)
        }
        try {
            func.name = name
            await this.funcRepository.save(func)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteFunc(id: number): Promise<void> {
        let func: Func = await this.funcRepository.findOneById(id)
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 416)
        }
        try {
            await this.funcRepository.removeById(id)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }


    async addPermission(id: number, permissionId: number): Promise<void> {
        let func: Func = await this.funcRepository.findOneById(id, { relations: ['permissions'] })
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 416)
        }
        let per: Permission = await this.permissionRepository.findOneById(permissionId, { relations: ['module'] })
        if (!per) {
            throw new HttpException('指定id=' + permissionId + '权限不存在', 416)
        }
        if (func.permissions.length > 0) {
            func.permissions.forEach(permission => {
                if (permission.id === permissionId) {
                    throw new HttpException('指定id=' + permissionId + '权限已经存在于指定id=' + id + '功能当中', 417)
                }
                if (permission.moduleId !== per.moduleId) {
                    throw new HttpException('指定id=' + id + '的功能只能添加指定id=' + permission.moduleId + '模块中的权限', 418)
                }
            })
        }
        try {
            func.permissions.push(per)
            await this.funcRepository.save(func)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

}