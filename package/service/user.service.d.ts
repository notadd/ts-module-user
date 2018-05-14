/// <reference types="express" />
import { UnionUserInfo } from "../interface/user/union.user.info";
import { StoreComponent } from "../interface/store.component";
import { Organization } from "../model/organization.entity";
import { Permission } from "../model/permission.entity";
import { InfoGroup } from "../model/info.group.entity";
import { InfoItem } from "../model/info.item.entity";
import { UserInfo } from "../model/user.info.entity";
import { Func } from "../model/func.entity";
import { Role } from "../model/role.entity";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
import { Request } from "express";
export declare class UserService {
    private readonly funcRepository;
    private readonly roleRepository;
    private readonly userRepository;
    private readonly storeComponent;
    private readonly userInfoRepository;
    private readonly infoGroupRepository;
    private readonly permissionRepository;
    private readonly organizationRepository;
    constructor(funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>, storeComponent: StoreComponent, userInfoRepository: Repository<UserInfo>, infoGroupRepository: Repository<InfoGroup>, permissionRepository: Repository<Permission>, organizationRepository: Repository<Organization>);
    getUserById(id: number): Promise<{
        id: number;
        userName: string;
        status: boolean;
        recycle: boolean;
    } | undefined>;
    getUserByName(userName: string): Promise<User | undefined>;
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
    createUserWithUserInfo(req: Request, organizationId: number, userName: string, password: string, groups: Array<{
        groupId: number;
        infos: Array<UnionUserInfo>;
    }>): Promise<void>;
    addUserInfoToUser(req: Request, id: number, groups: Array<{
        groupId: number;
        infos: Array<UnionUserInfo>;
    }>): Promise<void>;
    addUserInfosAndInfoItems(req: Request, user: User, group: InfoGroup, infos: Array<UnionUserInfo>): Promise<void>;
    transfromInfoValue(req: Request, match: InfoItem, info: UnionUserInfo): Promise<string>;
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
