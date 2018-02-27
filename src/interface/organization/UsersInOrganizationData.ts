export interface UsersInOrganizationData{
    code:number
    message:string
    users:{
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