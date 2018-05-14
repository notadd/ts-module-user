/// <reference types="express" />
import { Request } from "express";
import { Data } from "../interface/data";
import { RoleService } from "../service/role.service";
export declare class RoleResolver {
    private readonly roleService;
    constructor(roleService: RoleService);
    createRole(req: Request, body: {
        moduleToken: string;
        name: string;
        score: number;
    }): Promise<Data>;
    updateRole(req: Request, body: {
        id: number;
        name: string;
        score: number;
    }): Promise<Data>;
    deleteRole(req: Request, body: {
        id: number;
    }): Promise<Data>;
    setFuncs(req: Request, body: {
        id: number;
        funcIds: Array<number>;
    }): Promise<Data>;
}
