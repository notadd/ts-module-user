```
type Query{

    #获取所有根组织，即没有父组织的组织
    roots:RootsData

    #获取所有组织
    organizations:OrganizationsData

    #获取指定组织的子组织
    children(id:Int!):ChildrenData

    #获取指定组织的用户
    usersInOrganization(id:Int!):UsersInOrganizationData

}
```
```
type Mutation{

    #创建指定名称组织，父组织可选
    createOrganization(name:String!,parentId:Int):Data

    #更新指定id组织，可以更新名称、父组织
    updateOrganization(id:Int!,name:String!,parentId:Int):Data

    #删除指定组织
    deleteOrganization(id:Int!):Data

    #添加用户到指定组织
    addUserToOrganization(id:Int!,userId:Int!):Data

    #添加多个用户到指定组织
    addUsersToOrganization(id:Int!,userIds:[Int!]!):Data

    #从组织中移除用户
    removeUserFromOrganization(id:Int!,userId:Int!):Data

    #从组织中移除多个用户
    removeUsersFromOrganization(id:Int!,userIds:[Int!]!):Data
}
```
```
#所有组织返回数据
type OrganizationsData{

    #错误码
    code:Int

    #错误信息
    message:String

    #组织数组
    organizations:[Organization]

}
```
```
#根组织返回数据
type RootsData{

    #错误码
    code:Int

    #错误消息
    message:String

    #根组织数组
    roots:[Organization]
}
```
```
#子组织返回数据
type ChildrenData{

    #错误码
    code:Int

    #错误消息
    message:String

    #子组织数组
    children:[Organization]

}
```
```
#组织类型
type Organization{

    #id
    id:Int

    #组织名称
    name:String

}
```
```
#组织下用户的返回数据
type UsersInOrganizationData{

    #错误码
    code:Int

    #错误信息
    message:String

    #用户数组
    users:[User]

}
```
```
#用户类型
type User{

    #id
    id:Int

    #用户名
    userName:String

    #用户状态
    status:Boolean
}
```