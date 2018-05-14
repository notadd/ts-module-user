/// <reference types="express" />
import { Request } from "express";
import { Data } from "../interface/data";
import { ScoreService } from "../service/score.service";
export declare class ScoreResolver {
    private readonly scoreService;
    constructor(scoreService: ScoreService);
    getScore(req: Request, body: {
        userId: number;
        scoreTypeId: number;
    }): Promise<Data & {
        score: number;
    }>;
    setScore(req: Request, body: {
        userId: number;
        scoreTypeId: number;
        add: number;
    }): Promise<Data>;
}
