import { HttpException, Inject, UseInterceptors } from "@nestjs/common";
import { Mutation, Resolver } from "@nestjs/graphql";
import { Request } from "express";
import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Data } from "../interface/data";
import { Role } from "../model/role.entity";
import { RoleService } from "../service/role.service";

/* 角色是功能的集合，因为功能属于模块，则角色也属于某个模块，随着模块删除而删除 */
@Resolver("Role")
@UseInterceptors(ExceptionInterceptor)
export class RoleResolver {

    constructor(
        @Inject(RoleService) private readonly roleService: RoleService
    ) {
    }

    @Mutation("createRole")
    async createRole(req: Request, body: { moduleToken: string, name: string, score: number }): Promise<Data> {
        const { moduleToken, name, score } = body;
        if (!moduleToken || !name || !score) {
            throw new HttpException("缺少参数", 400);
        }
        await this.roleService.createRole(moduleToken, name, score);
        return { code: 200, message: "创建角色成功" };
    }

    @Mutation("updateRole")
    async updateRole(req: Request, body: { id: number, name: string, score: number }): Promise<Data> {
        const { id, name, score } = body;
        if (!id || !name || !score) {
            throw new HttpException("缺少参数", 400);
        }
        await this.roleService.updateRole(id, name, score);
        return { code: 200, message: "更新角色成功" };
    }

    @Mutation("deleteRole")
    async deleteRole(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.roleService.deleteRole(id);
        return { code: 200, message: "删除角色成功" };
    }

    @Mutation("setFuncs")
    async setFuncs(req: Request, body: { id: number, funcIds: Array<number> }): Promise<Data> {
        const { id, funcIds } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.roleService.setFuncs(id, funcIds);
        return { code: 200, message: "设置角色功能成功" };
    }
}
