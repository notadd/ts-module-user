/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { CreateUserBody } from '../interface/user/CreateUserBody';
import { FreedomUsersData } from '../interface/user/FreedomUsersData';
import { PermissionsData } from '../interface/user/PermissionsData';
import { RecycleUsersData } from '../interface/user/RecycleUsersData';
import { RolesData } from '../interface/user/RolesData';
import { UnionUserInfo } from '../interface/user/UnionUserInfo';
import { UpdateUserBody } from '../interface/user/UpdateUserBody';
import { UserInfosData } from '../interface/user/UserInfosData';
import { UsersData } from '../interface/user/UsersData';
import { UserService } from '../service/UserService';
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
        groups: {
            groupId: number;
            infos: UnionUserInfo[];
        }[];
    }): Promise<Data>;
    addUserInfo(req: IncomingMessage, body: {
        id: number;
        groups: {
            groupId: number;
            infos: UnionUserInfo[];
        }[];
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
        ids: number[];
    }): Promise<Data>;
    deleteUser(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    deleteUsers(req: IncomingMessage, body: {
        ids: number[];
    }): Promise<Data>;
    setRoles(req: IncomingMessage, body: {
        id: number;
        roleIds: number[];
    }): Promise<Data>;
    setUserOwnPermissions(req: IncomingMessage, body: {
        id: number;
        permissionIds: number[];
    }): Promise<Data>;
}
