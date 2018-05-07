import "reflect-metadata";

export const USER_INFO_MANAGER = "user:user_info_manager";

/*
用户信息管理器装饰器，用来标识一个组件为用户信息管理器
从而使用户中心在获取用户信息、删除用户等操作时，可以调用用户信息管理器的方法来对其他模块中的用户信息进行操作
因为其他模块不是全局模块，所以获取用户信息管理器组件的方法并不是通过nestjs的模块依赖组件注入，
而是根据装饰器的标识对组件进行遍历，将用户信息管理器保存到UserService中
*/
export function UserInfoManager(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(USER_INFO_MANAGER, true, target);
        return target;
    };
}
