import { EntityManager } from "typeorm";
export interface UserInfoManager {
    getUserInfo(userId: number): Promise<ModuleUserInfo>;
    deleteUserInfo(manager: EntityManager, userId: number): Promise<void>;
}
export interface ModuleUserInfo {
    moduleToken: string;
    userInfos: Map<Function, any>;
}
