import { ScoreType } from "./score.type.entity";
import { User } from "./user.entity";
export declare class Score {
    id: number;
    value: number;
    scoreTypeId: number;
    scoreType: ScoreType;
    userId: number;
    user: User;
}
