import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Func } from "../model/func.entity";
import { Module } from "../model/module.entity";
import { Role } from "../model/role.entity";

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Func) private readonly funcRepository: Repository<Func>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(Module) private readonly moduleRepository: Repository<Module>
    ) {
    }

    async createRole(moduleToken: string, name: string, score: number): Promise<void> {
        const module: Module|undefined = await this.moduleRepository.findOne(moduleToken);
        if (!module) {
            throw new HttpException("指定模块token=" + moduleToken + "不存在", 415);
        }
        const exist: Role|undefined = await this.roleRepository.findOne({ name, moduleToken });
        if (exist) {
            throw new HttpException("指定模块token=" + moduleToken + "下，指定名称name=" + name + "角色已经存在", 420);
        }
        const role: Role = this.roleRepository.create({ name, score, module });
        try {
            await this.roleRepository.save(role);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async updateRole(id: number, name: string, score: number): Promise<void> {
        const role: Role|undefined = await this.roleRepository.findOne(id);
        if (!role) {
            throw new HttpException("指定id=" + id + "角色不存在", 421);
        }
        if (name !== role.name) {
            const exist: Role|undefined = await this.roleRepository.findOne({ name, moduleToken: role.moduleToken });
            if (exist) {
                throw new HttpException("指定模块token=" + role.moduleToken + "下，指定名称name=" + name + "角色已经存在", 420);
            }
        }
        try {
            role.name = name;
            role.score = score;
            await this.roleRepository.save(role);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async deleteRole(id: number): Promise<void> {
        const role: Role|undefined = await this.roleRepository.findOne(id);
        if (!role) {
            throw new HttpException("指定id=" + id + "角色不存在", 421);
        }
        try {
            await this.roleRepository.remove(role);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async setFuncs(id: number, funcIds: Array<number>): Promise<void> {
        const role: Role|undefined = await this.roleRepository.findOne(id);
        if (!role) {
            throw new HttpException("指定id=" + id + "角色不存在", 421);
        }
        const funcs: Array<Func> = await this.funcRepository.findByIds(funcIds);
        funcIds.forEach(funcId => {
            const find: Func|undefined = funcs.find(func => {
                return func.id === funcId;
            });
            if (!find) {
                throw new HttpException("指定id=" + funcId + "功能不存在", 422);
            }
            if (find.moduleToken !== role.moduleToken) {
                throw new HttpException("指定角色、功能必须属于同一个模块", 423);
            }
        });
        try {
            role.funcs = funcs;
            await this.roleRepository.save(role);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

}
