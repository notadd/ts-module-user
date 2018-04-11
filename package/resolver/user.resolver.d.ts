/// <reference types="node" />
import { IncomingMessage } from "http";
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
    userInfos(req: IncomingMessage, body: {
        id: number;
    }): Promise<UserInfosData>;
    rolesInUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<RolesData>;
    permissionsInUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<PermissionsData>;
    createUser(req: IncomingMessage, body: CreateUserBody): Promise<Data>;
    createUserWithUserInfo(req: IncomingMessage, body: CreateUserBody & {
        groups: Array<{
            groupId: number;
            infos: Array<UnionUserInfo>;
        }>;
    }): Promise<Data>;
    addUserInfo(req: IncomingMessage, body: {
        id: number;
        groups: Array<{
            groupId: number;
            infos: Array<UnionUserInfo>;
        }>;
    }): Promise<Data>;
    updateUser(req: IncomingMessage, body: UpdateUserBody): Promise<Data>;
    bannedUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    unBannedUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    softDeleteUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    restoreUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    restoreUsers(req: IncomingMessage, body: {
        ids: Array<number>;
    }): Promise<Data>;
    deleteUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    deleteUsers(req: IncomingMessage, body: {
        ids: Array<number>;
    }): Promise<Data>;
    setRoles(req: IncomingMessage, body: {
        id: number;
        roleIds: Array<number>;
    }): Promise<Data>;
    setUserOwnPermissions(req: IncomingMessage, body: {
        id: number;
        permissionIds: Array<number>;
    }): Promise<Data>;
}
