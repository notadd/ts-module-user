import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { HttpException, Inject, UseInterceptors } from "@nestjs/common";
import { FuncService } from "../service/func.service";
import { Mutation, Resolver } from "@nestjs/graphql";
import { Func } from "../model/func.entity";
import { Data } from "../interface/data";
import { Request } from "express";

/* 功能是权限的集合，且只能包含一个模块下的权限，所以功能也属于某个模块 */
@Resolver("Func")
@UseInterceptors(ExceptionInterceptor)
export class FuncResolver {

    constructor(
        @Inject(FuncService) private readonly funcService: FuncService
    ) {}

    @Mutation("createFunc")
    async createFunc(req: Request, body: { moduleToken: string, name: string }): Promise<Data> {
        const { moduleToken, name } = body;
        if (!moduleToken || !name) {
            throw new HttpException("缺少参数", 400);
        }
        await this.funcService.createFunc(moduleToken, name);
        return { code: 200, message: "创建功能成功" };
    }

    @Mutation("updateFunc")
    async updateFunc(req: Request, body: { id: number, name: string }): Promise<Data> {
        const { id, name } = body;
        if (!id || !name) {
            throw new HttpException("缺少参数", 400);
        }
        await this.funcService.updateFunc(id, name);
        return { code: 200, message: "更新功能成功" };
    }

    @Mutation("deleteFunc")
    async deleteFunc(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.funcService.deleteFunc(id);
        return { code: 200, message: "删除功能成功" };
    }

    @Mutation("setPermissions")
    async setPermissions(req: Request, body: { id: number, permissionIds: Array<number> }): Promise<Data> {
        const { id, permissionIds } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.funcService.setPermissions(id, permissionIds);
        return { code: 200, message: "设置功能权限成功" };
    }
}
