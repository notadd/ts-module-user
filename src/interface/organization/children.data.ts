export interface ChildrenData {
    code: number;

    message: string;

    children: Array<{
        id: number
        name: string
    }>;
}
