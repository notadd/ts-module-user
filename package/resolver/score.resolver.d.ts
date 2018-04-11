/// <reference types="node" />
import { IncomingMessage } from "http";
import { Data } from "../interface/data";
import { ScoreService } from "../service/score.service";
export declare class ScoreResolver {
    private readonly scoreService;
    constructor(scoreService: ScoreService);
    getScore(req: IncomingMessage, body: {
        userId: number;
        scoreTypeId: number;
    }): Promise<Data & {
        score: number;
    }>;
    setScore(req: IncomingMessage, body: {
        userId: number;
        scoreTypeId: number;
        add: number;
    }): Promise<Data>;
}
