export interface ModulesData {
    code: number
    message: string
    modules: Module[]
}

interface Module {
    token: string
    roles: { id: number, name: string, score: number }[]
    funcs: { id: number, name: string }[]
    permissions: { id: number, name: string, description: string }[]
}