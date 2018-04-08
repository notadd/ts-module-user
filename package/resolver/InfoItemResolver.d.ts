/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { InfoItemService } from '../service/InfoItemService';
export declare class InfoItemResolver {
    private readonly infoItemService;
    constructor(infoItemService: InfoItemService);
    createInfoItem(req: IncomingMessage, body: {
        name: string;
        label: string;
        description: string;
        type: string;
        necessary: boolean;
        registerVisible: boolean;
        informationVisible: boolean;
        order: number;
    }): Promise<Data>;
    updateInfoItem(req: IncomingMessage, body: {
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
    deleteInfoItem(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    deleteInfoItems(req: IncomingMessage, body: {
        ids: number[];
    }): Promise<Data>;
}
