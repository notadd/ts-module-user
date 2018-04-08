/// <reference types="node" />
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { UserComponent } from '../export/UserComponentProvider';
import { Permission } from '../model/Permission.entity';
export declare const MODULE_TOKEN = "module_token";
export declare class PermissionGuard implements CanActivate {
    private readonly userComponent;
    constructor(userComponent: UserComponent);
    canActivate(req: IncomingMessage, context: ExecutionContext): Promise<boolean>;
    checkPermission(permissions: Permission[], and: string[], or: string[], token: string): boolean;
}
