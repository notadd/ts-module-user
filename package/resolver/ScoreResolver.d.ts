/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { ScoreService } from '../service/ScoreService';
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
