import { EntityManager } from "typeorm";

/*
用户信息管理器组件接口类型，目前只有获取用户信息、删除用户信息两个方法
当用户中心获取用户信息、删除用户时调用这两个方法
由于删除是事务操作，需要传递事务实体管理器
至于更新操作，还不确定
*/
export interface UserInfoManager {
    getUserInfo(userId: number): Promise<UserInfo>;
    deleteUserInfo(manager: EntityManager, userId: number): Promise<void>;
}

/*
用户中心获取用户信息时，其他模块的返回值类型
指明了模块token，以及一个信息Map，信息实体类为key，信息对象为value
*/
export interface UserInfo {
    moduleToken: string;
    userInfos: Map<Function, any>;
}