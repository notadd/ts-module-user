```
UserComponent是用户模块提供的供其他模块访问的组件，可以通过以下方式注入组件：
```
```
@Inject("UserComponentToken") private readonly userComponent: UserComponent
```
```
permissions(id: number): Promise<Array<Permission>>
获取指定id用户实际拥有的权限，即角色包含权限与额外加减权限的最终结果
```
```
login(userName: string, password: string): Promise<boolean | User | undefined>
用户登录方法，判断用户名与密码是否匹配，是返回匹配的用户对象，否返回false
```
```
getUserById(id: number): Promise<User | undefined>
获取指定id用户
```
```
getUserByName(userName: string): Promise<User | undefined>、
获取指定用户名用户
```
```
isExist(user: { id: number, userName: string, status: boolean, recycle: boolean }): Promise<boolean>
指定用户是否存在
```

