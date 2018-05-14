/// <reference types="express" />
import { Request } from "express";
import { Data } from "../interface/data";
import { ScoreTypesData } from "../interface/scoreType/score.types.data";
import { ScoreTypeService } from "../service/score.type.service";
export declare class ScoreTypeResolver {
    private readonly scoreTypeService;
    constructor(scoreTypeService: ScoreTypeService);
    scoreTypes(): Promise<ScoreTypesData>;
    createScoreType(req: Request, body: {
        name: string;
        type: string;
        description: string;
    }): Promise<Data>;
    updateScoreType(req: Request, body: {
        id: number;
        name: string;
        type: string;
        description: string;
    }): Promise<Data>;
    deleteScoreType(req: Request, body: {
        id: number;
    }): Promise<Data>;
    deleteScoreTypes(req: Request, body: {
        ids: Array<number>;
    }): Promise<Data>;
}
