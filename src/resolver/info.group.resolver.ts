import { HttpException, Inject, UseInterceptors } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";
import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Data } from "../interface/data";
import { InfoGroupsData } from "../interface/infoGroup/info.groups.data";
import { InfoItemsData } from "../interface/infoGroup/info.items.data";
import { InfoGroupService } from "../service/info.group.service";

/* 这个几个接口只是写在这，使用上还有很多问题 */
@Resolver("InfoGroup")
@UseInterceptors(ExceptionInterceptor)
export class InfoGroupResolver {

    constructor(
        @Inject(InfoGroupService) private readonly infoGroupService: InfoGroupService
    ) {
    }

    @Query("infoGroups")
    async infoGroups(): Promise<InfoGroupsData> {
        const infoGroups = await this.infoGroupService.getAll();
        return { code: 200, message: "获取所有信息组成功", infoGroups };
    }

    @Query("infoItems")
    async infoItems(req: IncomingMessage, body: { id: number }): Promise<InfoItemsData> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        const infoItems: any = await this.infoGroupService.getInfoItems(id);
        return { code: 200, message: "获取指定信息组的信息项成功", infoItems };
    }

    @Mutation("createInfoGroup")
    async createInfoGroup(req: IncomingMessage, body: { name: string }): Promise<Data> {
        const { name } = body;
        if (!name) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoGroupService.createInfoGroup(name);
        return { code: 200, message: "创建信息组成功" };
    }

    @Mutation("updateInfoGroup")
    async updateInfoGroup(req: IncomingMessage, body: { id: number, name: string }): Promise<Data> {
        const { id, name } = body;
        if (!id || !name) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoGroupService.updateInfoGroup(id, name);
        return { code: 200, message: "更新信息组成功" };
    }

    @Mutation("deleteInfoGroup")
    async deleteInfoGroup(req: IncomingMessage, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoGroupService.deleteInfoGroup(id);
        return { code: 200, message: "删除信息组成功" };
    }

    @Mutation("addInfoItem")
    async addInfoItem(req: IncomingMessage, body: { id: number, infoItemId: number }): Promise<Data> {
        const { id, infoItemId } = body;
        if (!id || !infoItemId) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoGroupService.addInfoItem(id, infoItemId);
        return { code: 200, message: "添加信息项成功" };
    }

    @Mutation("removeInfoItem")
    async removeInfoItem(req: IncomingMessage, body: { id: number, infoItemId: number }): Promise<Data> {
        const { id, infoItemId } = body;
        if (!id || !infoItemId) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoGroupService.removeInfoItem(id, infoItemId);
        return { code: 200, message: "移除信息项成功" };
    }
}
