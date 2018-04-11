/// <reference types="node" />
import { IncomingMessage } from "http";
import { Data } from "../interface/data";
import { FuncService } from "../service/func.service";
export declare class FuncResolver {
    private readonly funcService;
    constructor(funcService: FuncService);
    createFunc(req: IncomingMessage, body: {
        moduleToken: string;
        name: string;
    }): Promise<Data>;
    updateFunc(req: IncomingMessage, body: {
        id: number;
        name: string;
    }): Promise<Data>;
    deleteFunc(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    setPermissions(req: IncomingMessage, body: {
        id: number;
        permissionIds: Array<number>;
    }): Promise<Data>;
}
