/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { StoreComponent } from '../interface/StoreComponent';
import { UnionUserInfo } from '../interface/user/UnionUserInfo';
import { Func } from '../model/Func.entity';
import { InfoGroup } from '../model/InfoGroup.entity';
import { InfoItem } from '../model/InfoItem.entity';
import { Organization } from '../model/Organization.entity';
import { Permission } from '../model/Permission.entity';
import { Role } from '../model/Role.entity';
import { User } from '../model/User.entity';
import { UserInfo } from '../model/UserInfo.entity';
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
    getAll(): Promise<User[]>;
    getFreedomUsers(): Promise<User[]>;
    getRecycleUsers(): Promise<User[]>;
    userInfos(id: number): Promise<{
        name: string;
        value: string;
    }[]>;
    roles(id: number): Promise<Role[]>;
    permissions(id: number): Promise<Permission[]>;
    createUser(organizationId: number, userName: string, password: string): Promise<void>;
    createUserWithUserInfo(req: IncomingMessage, organizationId: number, userName: string, password: string, groups: {
        groupId: number;
        infos: UnionUserInfo[];
    }[]): Promise<void>;
    addUserInfoToUser(req: IncomingMessage, id: number, groups: {
        groupId: number;
        infos: UnionUserInfo[];
    }[]): Promise<void>;
    addUserInfosAndInfoItems(req: IncomingMessage, user: User, group: InfoGroup, infos: UnionUserInfo[]): Promise<void>;
    transfromInfoValue(req: IncomingMessage, match: InfoItem, info: UnionUserInfo): Promise<string>;
    updateUser(id: number, userName: string, password: string): Promise<void>;
    bannedUser(id: number): Promise<void>;
    unBannedUser(id: number): Promise<void>;
    softDeleteUser(id: number): Promise<void>;
    restoreUser(id: number): Promise<void>;
    restoreUsers(ids: number[]): Promise<void>;
    deleteUser(id: number): Promise<void>;
    deleteUsers(ids: number[]): Promise<void>;
    setRoles(id: number, roleIds: number[]): Promise<void>;
    setPermissions(id: number, permissionIds: number[]): Promise<void>;
}
