import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { HttpException, Inject, UseInterceptors } from "@nestjs/common";
import { InfoItemService } from "../service/info.item.service";
import { Mutation, Resolver } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 这个几个接口只是写在这，使用上还有很多问题,因为信息项可能不会编辑，所以不一定有用 */
@Resolver("InfoItem")
@UseInterceptors(ExceptionInterceptor)
export class InfoItemResolver {

    constructor(
        @Inject(InfoItemService) private readonly infoItemService: InfoItemService
    ) { }

    @Mutation("createInfoItem")
    async createInfoItem(req: Request, body: { name: string, label: string, description: string, type: string, necessary: boolean, registerVisible: boolean, informationVisible: boolean, order: number }): Promise<Data> {
        const { name, label, description, type, necessary, registerVisible, informationVisible, order } = body;
        if (!name || !label || !type || necessary === undefined || necessary === null) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoItemService.createInfoItem(name, label, description, type, necessary, registerVisible, informationVisible, order);
        return { code: 200, message: "创建信息项成功" };
    }

    @Mutation("updateInfoItem")
    async updateInfoItem(req: Request, body: { id: number, name: string, label: string, description: string, type: string, necessary: boolean, registerVisible: boolean, informationVisible: boolean, order: number }): Promise<Data> {
        const { id, name, label, description, type, necessary, registerVisible, informationVisible, order } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoItemService.updateInfoItem(id, name, label, description, type, necessary, registerVisible, informationVisible, order);
        return { code: 200, message: "更新信息项成功" };
    }

    @Mutation("deleteInfoItem")
    async deleteInfoItem(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoItemService.deleteInfoItem(id);
        return { code: 200, message: "删除信息项成功" };
    }

    @Mutation("deleteInfoItems")
    async deleteInfoItems(req: Request, body: { ids: Array<number> }): Promise<Data> {
        const { ids } = body;
        if (!ids || ids.length === 0) {
            throw new HttpException("缺少参数", 400);
        }
        await this.infoItemService.deleteInfoItems(ids);
        return { code: 200, message: "删除多个信息项成功" };
    }

}
