export interface RecycleUsersData {
    code: number;
    message: string;
    recycleUsers: Array<{
        id: number;
        userName: string;
        status: boolean;
    }>;
}
