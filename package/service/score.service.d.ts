import { Repository } from "typeorm";
import { Score } from "../model/score.entity";
import { ScoreType } from "../model/score.type.entity";
import { User } from "../model/user.entity";
import { FloatUtil } from "../util/float.util";
export declare class ScoreService {
    private readonly floatUtil;
    private readonly userRepository;
    private readonly scoreRepository;
    private readonly scoreTypeRepository;
    constructor(floatUtil: FloatUtil, userRepository: Repository<User>, scoreRepository: Repository<Score>, scoreTypeRepository: Repository<ScoreType>);
    getScore(userId: number, scoreTypeId: number): Promise<number>;
    setScore(userId: number, scoreTypeId: number, add: number): Promise<void>;
}
