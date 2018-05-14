/// <reference types="express" />
import { InfoGroupsData } from "../interface/infoGroup/info.groups.data";
import { InfoItemsData } from "../interface/infoGroup/info.items.data";
import { InfoGroupService } from "../service/info.group.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class InfoGroupResolver {
    private readonly infoGroupService;
    constructor(infoGroupService: InfoGroupService);
    infoGroups(): Promise<InfoGroupsData>;
    infoItems(req: Request, body: {
        id: number;
    }): Promise<InfoItemsData>;
    createInfoGroup(req: Request, body: {
        name: string;
    }): Promise<Data>;
    updateInfoGroup(req: Request, body: {
        id: number;
        name: string;
    }): Promise<Data>;
    deleteInfoGroup(req: Request, body: {
        id: number;
    }): Promise<Data>;
    addInfoItem(req: Request, body: {
        id: number;
        infoItemId: number;
    }): Promise<Data>;
    removeInfoItem(req: Request, body: {
        id: number;
        infoItemId: number;
    }): Promise<Data>;
}
