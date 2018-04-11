export interface InfoGroupsData {
    code: number;
    message: string;
    infoGroups: Array<{
        id: number;
        name: string;
        default: boolean;
        status: boolean;
    }>;
}
