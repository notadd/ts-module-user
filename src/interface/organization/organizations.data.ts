export interface OrganizationsData {
    code: number;

    message: string;

    organizations: Array<{
        id: number
        name: string
    }>;
}
