export interface FreedomUsersData{
    code:number
    message:string
    freedomUsers:{
        id:number
        userName:string
        nickname:string
        realName:string
        sex:string
        birthday:Date
        email:string
        cellPhoneNumber:string
        status:boolean
    }[]
}