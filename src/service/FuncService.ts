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


    async setPermissions(id: number, permissionIds: number[]): Promise<void> {
        let func: Func = await this.funcRepository.findOneById(id, { relations: ['permissions'] })
        if (!func) {
            throw new HttpException('指定id=' + id + '功能不存在', 416)
        }
        let pers: Permission[] = await this.permissionRepository.findByIds(permissionIds, { relations: ['module'] })
        //检查是否所有指定权限都存在
        permissionIds.forEach(permissionId => {
            let find: Permission = pers.find(per => {
                return per.id === permissionId
            })
            if (!find) {
                throw new HttpException('指定id=' + permissionId + '权限不存在', 417)
            }
        })
        //检查给定权限是否属于同一个模块
        pers.reduce((pre, next) => {
            if (pre.moduleId !== next.moduleId) {
                throw new HttpException('指定权限只能属于同一个模块', 418)
            }
            return next
        })
        //功能与权限要属于同一个模块
        if (func.moduleId && pers !== undefined && pers !== null && pers.length !== 0 && func.moduleId !== pers[0].moduleId) {
            throw new HttpException('指定权限与指定功能只能属于同一个模块', 419)
        }
        try {
            func.permissions = pers
            await this.funcRepository.save(func)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}