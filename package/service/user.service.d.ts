/// <reference types="node" />
import { IncomingMessage } from "http";
import { Repository } from "typeorm";
import { StoreComponent } from "../interface/store.component";
import { UnionUserInfo } from "../interface/user/union.user.info";
import { Func } from "../model/func.entity";
import { InfoGroup } from "../model/info.group.entity";
import { InfoItem } from "../model/info.item.entity";
import { Organization } from "../model/organization.entity";
import { Permission } from "../model/permission.entity";
import { Role } from "../model/role.entity";
import { User } from "../model/user.entity";
import { UserInfo } from "../model/user.info.entity";
export declare class UserService {
    private readonly storeComponent;
    private readonly funcRepository;
    private readonly roleRepository;
    private readonly userRepository;
    private readonly userInfoRepository;
    private readonly infoGroupRepository;
    private readonly permissionRepository;
    private readonly organizationRepository;
    constructor(storeComponent: StoreComponent, funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>, infoGroupRepository: Repository<InfoGroup>, permissionRepository: Repository<Permission>, organizationRepository: Repository<Organization>);
    getUserById(id: number): Promise<{
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    } | undefined>;
    getUserByName(userName: string): Promise<{
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    } | undefined>;
    getAll(): Promise<Array<User>>;
    getFreedomUsers(): Promise<Array<User>>;
    getRecycleUsers(): Promise<Array<User>>;
    userInfos(id: number): Promise<Array<{
        name: string;
        value: string;
    }>>;
    roles(id: number): Promise<Array<Role>>;
    permissions(id: number): Promise<Array<Permission>>;
    createUser(organizationId: number, userName: string, password: string): Promise<void>;
    createUserWithUserInfo(req: IncomingMessage, organizationId: number, userName: string, password: string, groups: Array<{
        groupId: number;
        infos: Array<UnionUserInfo>;
    }>): Promise<void>;
    addUserInfoToUser(req: IncomingMessage, id: number, groups: Array<{
        groupId: number;
        infos: Array<UnionUserInfo>;
    }>): Promise<void>;
    addUserInfosAndInfoItems(req: IncomingMessage, user: User, group: InfoGroup, infos: Array<UnionUserInfo>): Promise<void>;
    transfromInfoValue(req: IncomingMessage, match: InfoItem, info: UnionUserInfo): Promise<string>;
    updateUser(id: number, userName: string, password: string): Promise<void>;
    bannedUser(id: number): Promise<void>;
    unBannedUser(id: number): Promise<void>;
    softDeleteUser(id: number): Promise<void>;
    restoreUser(id: number): Promise<void>;
    restoreUsers(ids: Array<number>): Promise<void>;
    deleteUser(id: number): Promise<void>;
    deleteUsers(ids: Array<number>): Promise<void>;
    setRoles(id: number, roleIds: Array<number>): Promise<void>;
    setPermissions(id: number, permissionIds: Array<number>): Promise<void>;
}
