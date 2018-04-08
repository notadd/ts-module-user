export interface ScoreTypesData {
    code: number;
    message: string;
    scoreTypes: {
        id: number;
        name: string;
        type: string;
        default: boolean;
        description: string;
    }[];
}
