export interface RolesData {
    code: number;

    message: string;

    roles: Array<{ id: number, name: string, score: number }>;
}
