```
type Query{

    #获取所有积分类型
    scoreTypes:ScoreTypesData

}
```
```
type Mutation{

    #创建指定名称积分类型，指定积分值类型、描述
    createScoreType(name:String!,type:ScoreValueType!,description:String):Data

    #更新指定id积分类型
    updateScoreType(id:Int!,name:String!,type:ScoreValueType!,description:String!):Data

    #删除指定积分类型
    deleteScoreType(id:Int!):Data

    #删除多个积分类型
    deleteScoreTypes(ids:[Int!]!):Data

}
```
```
#积分值类型枚举
enum ScoreValueType{

    #浮点类型
    float

    #整数类型
    int

}
```
```
#所有积分类型返回数据
type ScoreTypesData{

    #错误码
    code:Int

    #错误信息
    message:String

    #积分类型数组
    scoreTypes:[ScoreType]

}
```
```
#积分类型
type ScoreType{

    #id
    id:Int

    #积分类型名称
    name:String

    #积分值类型
    type:String

    #是否为默认积分类型，默认的不可删除
    default:Boolean

    #描述
    description:String
}
```