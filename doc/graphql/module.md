```
type Query{

    #获取当前所有的模块，以及包含的权限、功能、角色，只有使用装饰器定义权限的模块会被扫描到
    modules:ModulesData
}
```
```
#所有模块返回数据
type ModulesData{

    #错误码
    code:Int

    #错误信息
    message:String

    #所有模块数组
    modules:[Module]
}
```
```
#模块类型
type Module{

    #模块标识符
    token:String

    #模块包含的角色
    roles:[Role]

    #模块包含的功能
    funcs:[Func]

    #模块包含的权限
    permissions:[Permission]
}
```
```
#权限类型
type Permission{

    #id
    id:Int

    #权限名称
    name:String

    #权限描述
    description:String
}
```
```
#功能类型
type Func{

    #功能id
    id:Int

    #功能名称
    name:String
}
```
```
#角色类型
type Role{

    #角色id
    id:Int

    #角色名称
    name:String

    #角色权重？目前没有使用
    score:Int
}
```