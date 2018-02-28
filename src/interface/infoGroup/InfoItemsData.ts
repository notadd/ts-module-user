export interface InfoItemsData{
    code:number
    message:string
    infoItems:{id:number,name:string,type:string,default:boolean,description:string,necessary:boolean,order:number}[]
}