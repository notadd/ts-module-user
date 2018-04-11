import { Score } from "./score.entity";
export declare class ScoreType {
    id: number;
    name: string;
    type: string;
    default: boolean;
    description: string;
    scores: Array<Score>;
}
