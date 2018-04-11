export interface ModulesData {
    code: number;

    message: string;

    modules: Array<Module>;
}

export interface Module {
    token: string;

    roles: Array<{ id: number, name: string, score: number }>;

    funcs: Array<{ id: number, name: string }>;

    permissions: Array<{ id: number, name: string, description: string }>;
}
