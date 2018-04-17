```
type Mutation{

    #创建指定模块下、指定名称、指定权重的角色
    createRole(moduleToken:String!,name:String!,score:Int!):Data

    #更新指定角色
    updateRole(id:Int!,name:String!,score:Int!):Data

    #删除指定角色
    deleteRole(id:Int!):Data

    #设置角色包含的功能
    setFuncs(id:Int!,funcIds:[Int!]!):Data
    
}
```