import { Repository } from "typeorm";
import { ScoreType } from "../model/score.type.entity";
export declare class ScoreTypeService {
    private readonly scoreTypeRepository;
    constructor(scoreTypeRepository: Repository<ScoreType>);
    getAll(): Promise<Array<ScoreType>>;
    createScoreType(name: string, type: string, description: string): Promise<void>;
    updateScoreType(id: number, name: string, type: string, description: string): Promise<void>;
    deleteScoreType(id: number): Promise<void>;
    deleteScoreTypes(ids: Array<number>): Promise<void>;
}
