export interface UsersInOrganizationData {
    code: number;

    message: string;

    users: Array<{
        id: number
        userName: string
        status: boolean
    }>;
}
