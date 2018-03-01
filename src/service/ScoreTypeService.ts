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

    async createScoreType(name:string, type:string, description:string):Promise<void>{
        let exist:ScoreType = await this.scoreTypeRepository.findOne({name})
        if(exist){
            throw new HttpException('指定名称积分类型已存在',424)
        }
        //方法中创建的积分项都是非默认的
        let scoreType:ScoreType = this.scoreTypeRepository.create({name,type,default:false,description})
        try {
            await this.scoreTypeRepository.save(scoreType)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}