/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { InfoGroupsData } from '../interface/infoGroup/InfoGroupsData';
import { InfoItemsData } from '../interface/infoGroup/InfoItemsData';
import { InfoGroupService } from '../service/InfoGroupService';
export declare class InfoGroupResolver {
    private readonly infoGroupService;
    constructor(infoGroupService: InfoGroupService);
    infoGroups(): Promise<InfoGroupsData>;
    infoItems(req: IncomingMessage, body: {
        id: number;
    }): Promise<InfoItemsData>;
    createInfoGroup(req: IncomingMessage, body: {
        name: string;
    }): Promise<Data>;
    updateInfoGroup(req: IncomingMessage, body: {
        id: number;
        name: string;
    }): Promise<Data>;
    deleteInfoGroup(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    addInfoItem(req: IncomingMessage, body: {
        id: number;
        infoItemId: number;
    }): Promise<Data>;
    removeInfoItem(req: IncomingMessage, body: {
        id: number;
        infoItemId: number;
    }): Promise<Data>;
}
