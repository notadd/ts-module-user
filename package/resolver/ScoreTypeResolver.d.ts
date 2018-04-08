/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { ScoreTypesData } from '../interface/scoreType/ScoreTypesData';
import { ScoreTypeService } from '../service/ScoreTypeService';
export declare class ScoreTypeResolver {
    private readonly scoreTypeService;
    constructor(scoreTypeService: ScoreTypeService);
    scoreTypes(): Promise<ScoreTypesData>;
    createScoreType(req: IncomingMessage, body: {
        name: string;
        type: string;
        description: string;
    }): Promise<Data>;
    updateScoreType(req: IncomingMessage, body: {
        id: number;
        name: string;
        type: string;
        description: string;
    }): Promise<Data>;
    deleteScoreType(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    deleteScoreTypes(req: IncomingMessage, body: {
        ids: number[];
    }): Promise<Data>;
}
