```
type Query{

    #获取当前所有信息组
    infoGroups:InfoGroupsData

    #获取指定id信息组的信息项
    infoItems(id:Int!):InfoItemsData

}
```
type Mutation{

    #创建指定名称信息组
    createInfoGroup(name:String!):Data

    #更新指定id信息组
    updateInfoGroup(id:Int!,name:String!):Data

    #删除指定id信息组
    deleteInfoGroup(id:Int!):Data

    #添加信息项到信息组
    addInfoItem(id:Int!,infoItemId:Int!):Data

    #从信息组移除信息项
    removeInfoItem(id:Int!,infoItemId:Int!):Data
}
```
#所有信息组的返回数据
type InfoGroupsData{

    #错误码
    code:Int

    #错误信息
    message:String

    #信息组数组
    infoGroups:[InfoGroup]
}
```
#信息组类型
type InfoGroup{

    #id
    id:Int

    #名称
    name:String

    #是否是默认信息组，默认信息组不可修改，在启动时创建
    default:Boolean

    #信息组状态
    status:Boolean
}
```
#信息组中信息项的返回数据
type InfoItemsData{

    #错误码
    code:Int

    #错误信息
    message:String

    #信息项数组
    infoItems:[InfoItem]
}
```
#信息项类型
type InfoItem{

    #id
    id:Int

    #信息项名称
    name:String

    #是否为默认信息项
    default:Boolean

    #信息项描述
    description:String

    #信息项类型，代表了信息值输入方式
    type:String

    #是否为必填信息项
    necessary:Boolean

    #排序
    order:Int
}
```