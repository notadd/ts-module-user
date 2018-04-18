```
PermissionController(names: Array<string>, mode: "or" | "and" = "and")
```
```
示例：
@Controller("User")
@PermissionController(["admin"])
export class UserController{

    @Post("create")
    @PermissionController(["CreateUser"])
    async createUser(){
        ...
    }
}
```
```
装饰器用来控制方法的访问权限，这个装饰器定义的元数据会在PermissionGuard的canActivate方法中被获取，进而判断用户是否具有访问接口的权限
```
```
装饰器工厂有两个参数，第一个参数为权限名数组，第二个参数为模式，即这些权限是“或”还是“且”关系
```
```
装饰器工厂可以在类、方法上使用，必须类、方法上权限同时通过，才可以访问接口
```
```
装饰器工厂也可以使用多次，多次使用定义的and权限与or权限会被合并，当同时存在and、or权限时，必须通过所有and权限且通过or权限之一
```
```
最后的权限是否通过公式为：classAnd1&&classAnd2&&(classOr1||classOr2) && method_and1&&method_and2&&(method_or1||method2)
```
```
PermissionController定义控制数据的key为user:permission_controller_or、user:permission_controller_and，分别代表or权限与and权限
```