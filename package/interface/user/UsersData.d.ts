export interface UsersData {
    code: number;
    message: string;
    users: {
        id: number;
        userName: string;
        status: boolean;
    }[];
}
