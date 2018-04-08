import { Repository } from 'typeorm';
import { Score } from '../model/Score.entity';
import { ScoreType } from '../model/ScoreType.entity';
import { User } from '../model/User.entity';
import { FloatUtil } from '../util/FloatUtil';
export declare class ScoreService {
    private readonly floatUtil;
    private readonly userRepository;
    private readonly scoreRepository;
    private readonly scoreTypeRepository;
    constructor(floatUtil: FloatUtil, userRepository: Repository<User>, scoreRepository: Repository<Score>, scoreTypeRepository: Repository<ScoreType>);
    getScore(userId: number, scoreTypeId: number): Promise<number>;
    setScore(userId: number, scoreTypeId: number, add: number): Promise<void>;
}
