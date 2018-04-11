/// <reference types="node" />
import { IncomingMessage } from "http";
import { Data } from "../interface/data";
import { ScoreTypesData } from "../interface/scoreType/score.types.data";
import { ScoreTypeService } from "../service/score.type.service";
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
        ids: Array<number>;
    }): Promise<Data>;
}
