export interface FreedomUsersData {
    code: number

    message: string

    freedomUsers: {
        id: number
        userName: string
        status: boolean
    }[]
}
