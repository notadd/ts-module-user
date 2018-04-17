```
type Query{

    #获取指定用户，指定积分类型的积分值
    getScore(userId:Int!,scoreTypeId:Int!):ScoreData
}
```
```
type Mutation{

    #设置指定用户、指定积分类型的积分增量，可以为负值
    setScore(userId:Int!,scoreTypeId:Int!,add:Float!):Data

}
```
```
#获取积分返回数据
type ScoreData{

    #错误码
    code:Int

    #错误信息
    message:String

    #积分值
    score:Float

}
```