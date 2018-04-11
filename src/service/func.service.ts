import { Component, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Func } from "../model/func.entity";
import { Module } from "../model/module.entity";
import { Permission } from "../model/permission.entity";

@Component()
export class FuncService {

    constructor(
        @InjectRepository(Func) private readonly funcRepository: Repository<Func>,
        @InjectRepository(Module) private readonly moduleRepository: Repository<Module>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
    ) {
    }

    async createFunc(moduleToken: string, name: string): Promise<void> {
        const module: Module|undefined = await this.moduleRepository.findOneById(moduleToken);
        if (!module) {
            throw new HttpException("指定模块token=" + moduleToken + "不存在", 415);
        }
        const exist: Func|undefined = await this.funcRepository.findOne({ name, moduleToken });
        if (exist) {
            throw new HttpException("指定模块token=" + moduleToken + "下，指定名称name=" + name + "功能已经存在", 416);
        }
        const func: Func = this.funcRepository.create({ name, module });
        try {
            await this.funcRepository.save(func);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async updateFunc(id: number, name: string): Promise<void> {
        const func: Func|undefined = await this.funcRepository.findOneById(id);
        if (!func) {
            throw new HttpException("指定id=" + id + "功能不存在", 417);
        }
        if (name !== func.name) {
            const exist: Func|undefined = await this.funcRepository.findOne({ name, moduleToken: func.moduleToken });
            if (exist) {
                throw new HttpException("指定模块token=" + func.moduleToken + "下，指定名称name=" + name + "功能已经存在", 416);
            }
            try {
                func.name = name;
                await this.funcRepository.save(func);
            } catch (err) {
                throw new HttpException("数据库错误" + err.toString(), 401);
            }
        }
    }

    async deleteFunc(id: number): Promise<void> {
        const func: Func|undefined = await this.funcRepository.findOneById(id);
        if (!func) {
            throw new HttpException("指定id=" + id + "功能不存在", 417);
        }
        try {
            await this.funcRepository.remove(func);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async setPermissions(id: number, permissionIds: Array<number>): Promise<void> {
        const func: Func|undefined = await this.funcRepository.findOneById(id, { relations: [ "permissions" ] });
        if (!func) {
            throw new HttpException("指定id=" + id + "功能不存在", 417);
        }
        const pers: Array<Permission> = await this.permissionRepository.findByIds(permissionIds, { relations: [ "module" ] });
        // 检查是否所有指定权限都存在
        permissionIds.forEach(permissionId => {
            const find: Permission|undefined = pers.find(per => {
                return per.id === permissionId;
            });
            if (!find) {
                throw new HttpException("指定id=" + permissionId + "权限不存在", 418);
            }
            if (find.moduleToken !== func.moduleToken) {
                throw new HttpException("指定功能、权限只能属于同一个模块", 419);
            }
        });
        try {
            func.permissions = pers;
            await this.funcRepository.save(func);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }
}
