export interface RecycleUsersData {
    code: number

    message: string

    recycleUsers: {
        id: number
        userName: string
        status: boolean
    }[]
}
