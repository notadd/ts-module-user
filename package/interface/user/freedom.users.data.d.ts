export interface FreedomUsersData {
    code: number;
    message: string;
    freedomUsers: Array<{
        id: number;
        userName: string;
        status: boolean;
    }>;
}
