```
Permissions(definitions: Array<{ name: string, description: string }>)
```
```
示例：
@Can(["admin"])
@Controller("User")
@Permissions([
    {name:"admin",description:"Permission for Administrator "}
    {name:"CreateUser",description:"Permission for create user"}
])
export class UserController{

    @Post("create")
    @Can(["CreateUser"])
    async createUser(){
        ...
    }
}
```
```
为权限定义装饰器，可以定义多个{ name: string, description: string }对象数组，每个对象代表了一个权限
```
```
权限只能定义在Graphql的resolver组件或Controller上，类或者方法上都可以定义权限
```
```
在同一个模块中定义权限，权限名不可重复，如果重复，后者会覆盖前者
```
```
在不同模块中可以使用相同的权限名，不会覆盖
```
```
权限使用reflect-metadata定义为元数据，key为user:permission_definition
```