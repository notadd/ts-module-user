export interface UsersData {
    code: number;

    message: string;

    users: Array<{
        id: number
        userName: string
        status: boolean
    }>;
}
