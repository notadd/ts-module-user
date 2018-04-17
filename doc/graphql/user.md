```
type Query{

    #获取所有用户，不包括回收站用户
    users:UsersData

    #获取所有自由用户，即无组织用户
    freedomUsers:FreedomUsersData

    #获取回收站用户
    recycleUsers:RecycleUsersData

    #获取指定id用户的用户信息
    userInfos(id:Int!):UserInfosData

    #获取指定用户角色
    rolesInUser(id:Int!):RolesData

    #获取指定用户实际拥有的权限，即角色包含权限与额外添加、减去权限到最终结果
    permissionsInUser(id:Int!):PermissionsData
}
```
```
type Mutation{

    #创建指定用户，指定用户名、密码、组织可选
    createUser(
        organizationId: Int,
        userName: String!,
        password: String!,
    ):Data

    #指定用户信息创建用户
    createUserWithUserInfo(
        organizationId: Int,
        userName: String!,
        password: String!,
        groups: [UserInfoGroup]
    ):Data

    #更新指定id用户
    updateUser(
        id:Int,
        userName: String,
        password: String,
    ):Data

    #为用户添加用户信息
    addUserInfo(
        id:Int!,
        groups: [UserInfoGroup]
    ):Data

    #封禁单个用户
    bannedUser(id:Int!):Data

    #封禁多个用户
    unBannedUser(id:Int!):Data

    #指定用户放入回收站中
    softDeleteUser(id:Int!):Data

    #从回收站中恢复指定用户
    restoreUser(id:Int!):Data

    #从回收站中恢复多个用户
    restoreUsers(ids:[Int!]!):Data

    #删除指定用户，被删除用户必须在回收站中
    deleteUser(id:Int!):Data

    #删除多个用户
    deleteUsers(ids:[Int!]!):Data

    #设置用户角色
    setRoles(id:Int!,roleIds:[Int!]!):Data

    #设置用户权限，设置的是用户最终拥有权限，会根据用户角色拥有权限重新计算额外加减权限
    setUserOwnPermissions(id:Int!,permissionIds:[Int!]!):Data
}
```
```
#所有用户返回数据
type UsersData{

    #错误码
    code:Int

    #错误信息
    message:String

    #用户数组
    users:[User]

}
```
```
#自由用户返回数据
type FreedomUsersData{

    #错误码
    code:Int

    #错误信息
    message:String

    #用户数组
    freedomUsers:[User]

}
```
```
#回收站用户返回数据
type RecycleUsersData{

    #错误码
    code:Int

    #错误信息
    message:String

    #回收站用户数组
    recycleUsers:[User]

}
```
```
#用户信息组输入类型
input UserInfoGroup{

    #信息组id
    groupId:Int

    #信息数组，为各种用户信息的联合类型
    infos:[UnionUserInfo]
}
```
```
#用户信息类型
input  UnionUserInfo{

    #信息项名称
    name:String!

    #信息值，text类型会使用
    value:String

    #信息值数组，checkbox类型会使用
    array:[String]

    #文件base64编码，文件类型信息会使用
    base64:String

    #文件原名
    rawName:String

    #上传空间名
    bucketName:String

}
```
```
#用户信息返回数据
type UserInfosData{

    #错误码
    code:Int

    #错误信息
    message:String

    #用户信息数组
    userInfos:[UserInfo]

}
```
```
用户信息类型
type UserInfo{

    #信息项名称
    key:String

    #信息值，文本为直接值，数组为逗号拼接值，文件为访问url
    value:String

}
```
```
#用户角色返回数据
type RolesData{

    #错误码
    code:Int

    #错误信息
    message:String

    #角色数组
    roles:[Role]

}
```
```
#用户权限返回数据
type PermissionsData{

    #错误码
    code:Int

    #错误信息
    message:String

    #权限数组
    permissions:[Permission]

}
```