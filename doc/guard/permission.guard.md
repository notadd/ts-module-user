```
PermissionGuard执行权限拦截，根据当前用户id获取用户具有权限，再获取Can装饰器定义的访问控制权限，决定接口是否可以访问
```
```
示例：
@Can(["admin"])
@Controller("User")
@Permissions([
    {name:"admin",description:"Permission for Administrator "}
    {name:"CreateUser",description:"Permission for create user"}
])
@UseGuards(PermissionGuard)
export class UserController{

    @Post("create")
    @Can(["CreateUser"])
    async createUser(){
        ...
    }
}
```
```
注意：由于不同模块权限名可能重复，PermissionGuard只会根据用户拥有的权限中属于当前模块的权限进行判断，权限不能跨模块
```