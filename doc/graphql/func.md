```
type Mutation{

    #创建指定模块下的功能，指定模块token、功能名称
    createFunc(moduleToken:String!,name:String!):Data

    #更新指定功能的名称
    updateFunc(id:Int!,name:String!):Data

    #删除指定功能
    deleteFunc(id:Int!):Data

    #设置功能包含的权限
    setPermissions(id:Int!,permissionIds:[Int!]!):Data
    
}
```
