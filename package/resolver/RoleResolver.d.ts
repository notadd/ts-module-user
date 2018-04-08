/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { RoleService } from '../service/RoleService';
export declare class RoleResolver {
    private readonly roleService;
    constructor(roleService: RoleService);
    createRole(req: IncomingMessage, body: {
        moduleToken: string;
        name: string;
        score: number;
    }): Promise<Data>;
    updateRole(req: IncomingMessage, body: {
        id: number;
        name: string;
        score: number;
    }): Promise<Data>;
    deleteRole(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    setFuncs(req: IncomingMessage, body: {
        id: number;
        funcIds: number[];
    }): Promise<Data>;
}
