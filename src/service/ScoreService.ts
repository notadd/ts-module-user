import { HttpException, Inject, Component } from '@nestjs/common';
import { Repository, Connection, EntityManager } from 'typeorm';
import { ScoreType } from '../model/ScoreType';
import { Score } from '../model/Score';
import { IncomingMessage } from 'http';
import { User } from '../model/User';
@Component()
export class ScoreService {

    constructor(
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
        @Inject('UserPMModule.ScoreRepository') private readonly scoreRepository: Repository<Score>,
        @Inject('UserPMModule.ScoreTypeRepository') private readonly scoreTypeRepository: Repository<ScoreType>
    ) { }

    async getScore(userId: number, scoreTypeId: number): Promise<number> {
        let scoreType: ScoreType = await this.scoreTypeRepository.findOneById(scoreTypeId)
        if (!scoreType) {
            throw new HttpException('指定id=' + scoreTypeId + '积分类型不存在', 427)
        }
        let user: User = await this.userRepository.findOneById(userId, { relations: ['scores'] })
        if (!user) {
            throw new HttpException('指定id=' + userId + '用户不存在', 428)
        }
        let score: Score = user.scores.find(score => {
            return score.name === scoreType.name
        })
        /* 如果积分存在直接返回 */
        if (score) {
            if (scoreType.type === 'int') {
                return Number.parseInt(score.value + '')
            } else if (scoreType.type === 'float') {
                return Number.parseFloat(score.value + '')
            }
        }
        /* 积分不存在创建，并存储，初值为0 */
        else {
            let score: Score = this.scoreRepository.create({ name: scoreType.name, value: 0, scoreType, user })
            try {
                await this.scoreRepository.save(score)
            } catch (err) {
                throw new HttpException('数据库错误' + err.toString(), 401)
            }
            return 0
        }
    }

    async setScore(userId: number, scoreTypeId: number, add: number): Promise<void> {
        let scoreType: ScoreType = await this.scoreTypeRepository.findOneById(scoreTypeId)
        if (!scoreType) {
            throw new HttpException('指定id=' + scoreTypeId + '积分类型不存在', 427)
        }
        let user: User = await this.userRepository.findOneById(userId, { relations: ['scores'] })
        if (!user) {
            throw new HttpException('指定id=' + userId + '用户不存在', 428)
        }
        let score: Score = user.scores.find(score => {
            return score.name === scoreType.name
        })
        /* 如果积分存在加上添加值 */
        if (score) {
            if (scoreType.type === 'int') {
                score.value = Number.parseInt(score.value + '') + Number.parseInt(add + '')
            } else if (scoreType.type === 'float') {
                score.value = Number.parseFloat(score.value + '') + Number.parseFloat(add + '')
            }
        }
        /* 积分不存在创建，并存储，初值为0 */
        else {
            score = this.scoreRepository.create({ name: scoreType.name, scoreType, user })
            if (scoreType.type === 'int') {
                score.value = Number.parseInt(add + '')
            } else if (scoreType.type === 'float') {
                score.value = Number.parseFloat(add + '')
            }
        }
        try {
            await this.scoreRepository.save(score)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

}