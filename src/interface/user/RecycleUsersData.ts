export interface RecycleUsersData{
    code:number
    message:string
    recycleUsers:{
        id:number
        userName:string
        nickname:string
        realName:string
        sex:string
        birthday:Date
        email:string
        cellPhoneNumber:string
        status:boolean
        recycle:boolean
    }[]
}