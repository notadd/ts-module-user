import { Repository } from 'typeorm';
import { ScoreType } from '../model/ScoreType.entity';
export declare class ScoreTypeService {
    private readonly scoreTypeRepository;
    constructor(scoreTypeRepository: Repository<ScoreType>);
    getAll(): Promise<ScoreType[]>;
    createScoreType(name: string, type: string, description: string): Promise<void>;
    updateScoreType(id: number, name: string, type: string, description: string): Promise<void>;
    deleteScoreType(id: number): Promise<void>;
    deleteScoreTypes(ids: number[]): Promise<void>;
}
