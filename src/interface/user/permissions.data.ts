export interface PermissionsData {
    code: number;

    message: string;

    permissions: Array<{ id: number, name: string, description: string }>;
}
