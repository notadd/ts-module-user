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

    async createScoreType(name: string, type: string, description: string): Promise<void> {
        let exist: ScoreType = await this.scoreTypeRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定名称积分类型已存在', 424)
        }
        //方法中创建的积分项都是非默认的
        let scoreType: ScoreType = this.scoreTypeRepository.create({ name, type, default: false, description })
        try {
            await this.scoreTypeRepository.save(scoreType)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateScoreType(id: number, name: string, type: string, description: string): Promise<void> {
        let original: ScoreType = await this.scoreTypeRepository.findOneById(id)
        if (!original) {
            throw new HttpException('指定名id积分类型不存在', 425)
        }
        if (original.default) {
            throw new HttpException('默认积分类型不允许更改', 425)
        }
        if(name!==original.name){
            let exist:ScoreType = await this.scoreTypeRepository.findOne({name})
            if(exist){
                throw new HttpException('指定名称积分类型已存在', 424)
            }
        }
        try {
            original.name = name
            original.type = type 
            original.description = description
            await this.scoreTypeRepository.save(original)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}