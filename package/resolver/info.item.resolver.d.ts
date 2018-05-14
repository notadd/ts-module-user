/// <reference types="express" />
import { InfoItemService } from "../service/info.item.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class InfoItemResolver {
    private readonly infoItemService;
    constructor(infoItemService: InfoItemService);
    createInfoItem(req: Request, body: {
        name: string;
        label: string;
        description: string;
        type: string;
        necessary: boolean;
        registerVisible: boolean;
        informationVisible: boolean;
        order: number;
    }): Promise<Data>;
    updateInfoItem(req: Request, body: {
        id: number;
        name: string;
        label: string;
        description: string;
        type: string;
        necessary: boolean;
        registerVisible: boolean;
        informationVisible: boolean;
        order: number;
    }): Promise<Data>;
    deleteInfoItem(req: Request, body: {
        id: number;
    }): Promise<Data>;
    deleteInfoItems(req: Request, body: {
        ids: Array<number>;
    }): Promise<Data>;
}
