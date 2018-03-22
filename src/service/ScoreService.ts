import { HttpException, Inject, Component } from '@nestjs/common';
import { Repository, Connection, EntityManager } from 'typeorm';
import { ScoreType } from '../model/ScoreType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FloatUtil } from '../util/FloatUtil';
import { Score } from '../model/Score.entity';
import { User } from '../model/User.entity';
import { IncomingMessage } from 'http';


@Component()
export class ScoreService {

    constructor(
        @Inject(FloatUtil) private readonly floatUtil: FloatUtil,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
        @InjectRepository(ScoreType) private readonly scoreTypeRepository: Repository<ScoreType>
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
            return score.scoreTypeId === scoreType.id
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
            let score: Score = this.scoreRepository.create({ value: 0, scoreType, user })
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
            return score.scoreTypeId === scoreType.id
        })
        /* 如果积分存在加上添加值 */
        if (score) {
            if (scoreType.type === 'int') {
                score.value = Number.parseInt(score.value + '') + Number.parseInt(add + '')
            } else if (scoreType.type === 'float') {
                score.value = await this.floatUtil.add(score.value, add)
            }
        }
        /* 积分不存在创建，并存储，初值为0 */
        else {
            score = this.scoreRepository.create({ scoreType, user })
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