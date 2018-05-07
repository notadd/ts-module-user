```
UserInfoManager()装饰器是一个类装饰器，用来标识一个组件为用户信息管理器。可以让用户中心通过这个组件管理其他模块的用户信息
```
```
这个装饰器会将组件类的user:user_info_manager属性设置为true，即表明这是一个用户信息管理器
当用户中心模块启动时，在onModuleInit方法中扫描所有组件，将所有的用户信息管理器添加到UserService.userInfoManagers属性中去
这种注入方式，不是通过nestjs的模块依赖进行注入，属于手动注入
这里的关联是动态的，每次启动时进行关联，关联关系只存在于运行时
```
```
用户信息管理器必须具有以下接口：
export interface UserInfoManager {
    getUserInfo(userId: number): Promise<ModuleUserInfo>;
    deleteUserInfo(manager: EntityManager, userId: number): Promise<void>;
}

export interface ModuleUserInfo {
    moduleToken: string;
    userInfos: Map<Function, any>;
}

getUserInfo(userId: number)
即一个获取其他模块用户信息的方法，这个方法暂时还没有被用户中心调用，
它的返回值是这个模块的token以及用户信息Map
Map的key是存储信息的实体类构造函数，Map的value是存储信息的实体对象

deleteUserInfo(manager: EntityManager, userId: number)
即一个删除指定id用户信息的方法，因为用户信息存储在其他模块中，使用userId来与User实体关联
但是并没有数据库外键关联，所以用这种方式来保证删除用户时，其存储在其他模块中用户信息也可以被删除
第一个参数manager为事务实体管理器，删除操作应该是事务性的
这个方法在UserService.deleteUser方法中被调用

用户中心无法检查信息管理器的方法实现，由其自行决定哪些用户信息可以被用户中心获取或者删除
```
