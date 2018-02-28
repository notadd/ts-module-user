export interface InfoGroupsData {
    code: number
    message: string
    infoGroups: { id: number, name: string, default: boolean, status: boolean }[]
}