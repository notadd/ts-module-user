/// <reference types="express" />
import { FuncService } from "../service/func.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class FuncResolver {
    private readonly funcService;
    constructor(funcService: FuncService);
    createFunc(req: Request, body: {
        moduleToken: string;
        name: string;
    }): Promise<Data>;
    updateFunc(req: Request, body: {
        id: number;
        name: string;
    }): Promise<Data>;
    deleteFunc(req: Request, body: {
        id: number;
    }): Promise<Data>;
    setPermissions(req: Request, body: {
        id: number;
        permissionIds: Array<number>;
    }): Promise<Data>;
}
