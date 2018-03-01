import { HttpException, Inject, Component } from '@nestjs/common';
import { Repository, Connection, EntityManager } from 'typeorm';
import { ScoreType } from '../model/ScoreType';
import { IncomingMessage } from 'http';

@Component()
export class ScoreTypeService {

    constructor(
        @Inject('UserPMModule.ScoreTypeRepository') private readonly scoreTypeRepository: Repository<ScoreType>
    ) { }

    async getAll(): Promise<ScoreType[]> {
        return await this.scoreTypeRepository.find()
    }

}