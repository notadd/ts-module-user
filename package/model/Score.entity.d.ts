import { ScoreType } from './ScoreType.entity';
import { User } from './User.entity';
export declare class Score {
    id: number;
    value: number;
    scoreTypeId: number;
    scoreType: ScoreType;
    userId: number;
    user: User;
}
