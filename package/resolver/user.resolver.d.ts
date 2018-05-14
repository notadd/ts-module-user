/// <reference types="express" />
import { Request } from "express";
import { Data } from "../interface/data";
import { CreateUserBody } from "../interface/user/create.user.body";
import { FreedomUsersData } from "../interface/user/freedom.users.data";
import { PermissionsData } from "../interface/user/permissions.data";
import { RecycleUsersData } from "../interface/user/recycle.users.data";
import { RolesData } from "../interface/user/roles.data";
import { UnionUserInfo } from "../interface/user/union.user.info";
import { UpdateUserBody } from "../interface/user/update.user.body";
import { UserInfosData } from "../interface/user/user.infos.data";
import { UsersData } from "../interface/user/users.data";
import { UserService } from "../service/user.service";
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    users(): Promise<UsersData>;
    freedomUsers(): Promise<FreedomUsersData>;
    recycleUsers(): Promise<RecycleUsersData>;
    userInfos(req: Request, body: {
        id: number;
    }): Promise<UserInfosData>;
    rolesInUser(req: Request, body: {
        id: number;
    }): Promise<RolesData>;
    permissionsInUser(req: Request, body: {
        id: number;
    }): Promise<PermissionsData>;
    createUser(req: Request, body: CreateUserBody): Promise<Data>;
    createUserWithUserInfo(req: Request, body: CreateUserBody & {
        groups: Array<{
            groupId: number;
            infos: Array<UnionUserInfo>;
        }>;
    }): Promise<Data>;
    addUserInfo(req: Request, body: {
        id: number;
        groups: Array<{
            groupId: number;
            infos: Array<UnionUserInfo>;
        }>;
    }): Promise<Data>;
    updateUser(req: Request, body: UpdateUserBody): Promise<Data>;
    bannedUser(req: Request, body: {
        id: number;
    }): Promise<Data>;
    unBannedUser(req: Request, body: {
        id: number;
    }): Promise<Data>;
    softDeleteUser(req: Request, body: {
        id: number;
    }): Promise<Data>;
    restoreUser(req: Request, body: {
        id: number;
    }): Promise<Data>;
    restoreUsers(req: Request, body: {
        ids: Array<number>;
    }): Promise<Data>;
    deleteUser(req: Request, body: {
        id: number;
    }): Promise<Data>;
    deleteUsers(req: Request, body: {
        ids: Array<number>;
    }): Promise<Data>;
    setRoles(req: Request, body: {
        id: number;
        roleIds: Array<number>;
    }): Promise<Data>;
    setUserOwnPermissions(req: Request, body: {
        id: number;
        permissionIds: Array<number>;
    }): Promise<Data>;
}
