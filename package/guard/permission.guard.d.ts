/// <reference types="node" />
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { IncomingMessage } from "http";
import { UserComponent } from "../export/user.component.provider";
import { Permission } from "../model/permission.entity";
export declare const MODULE_TOKEN = "module_token";
export declare class PermissionGuard implements CanActivate {
    private readonly userComponent;
    constructor(userComponent: UserComponent);
    canActivate(req: IncomingMessage, context: ExecutionContext): Promise<boolean>;
    checkPermission(permissions: Array<Permission>, and: Array<string>, or: Array<string>, token: string): boolean;
}
