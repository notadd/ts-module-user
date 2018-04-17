```
type Mutation{

    #创建指定名称、描述、类型、是否必填、排序的信息项
    createInfoItem(name:String!,description:String,type:InfoItemType!,necessary:Boolean!,order:Int):Data

    #更新指定id信息项
    updateInfoItem(id:Int!,name:String,description:String,type:InfoItemType,necessary:Boolean,order:Int):Data

    #删除指定信息项
    deleteInfoItem(id:Int!):Data

    #删除多个信息项
    deleteInfoItems(ids:[Int!]!):Data
}
```
```
#信息项类型枚举，根据类型不同，信息值的输入方式不同
enum InfoItemType{

    #普通文本
    text

    #数字类型
    number

    #多行文本
    textarea

    #单选
    radio

    #日期
    date

    #下拉菜单
    pulldownmenu

    #复选框
    checkbox

    #上传文件
    uploadfile

    #带预览的上传图片
    uploadimagewithpreview
}
```