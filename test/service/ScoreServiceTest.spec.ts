import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { TestingModule } from '@nestjs/testing/testing-module';
import { ScoreService } from '../../src/service/ScoreService';
import { ScoreType } from '../../src/model/ScoreType';
import { FloatUtil } from '../../src/util/FloatUtil';
import { Repository, Connection } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Score } from '../../src/model/Score';
import { User } from '../../src/model/User';
import { Test } from '@nestjs/testing';
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';


describe('ScoreService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let scoreService: ScoreService
    let userRepository: Repository<User>
    let scoreRepository: Repository<Score>
    let scoreTypeRepository: Repository<ScoreType>
    let tables = ['score', 'user', 'score_type']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, FloatUtil, ScoreService]
        }).compile()
        connection = testModule.get('UserPMModule.Connection')
        scoreService = testModule.get<ScoreService>(ScoreService)
        userRepository = testModule.get('UserPMModule.UserRepository')
        scoreRepository = testModule.get('UserPMModule.ScoreRepository')
        scoreTypeRepository = testModule.get('UserPMModule.ScoreTypeRepository')
    }, 10000)

    /* 在每个it运行之前都会运行，而不是在这一级包含的每个describe运行之前 */
    beforeEach(async () => {
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
    })

    afterAll(async () => {
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    describe('getScore', async () => {

        it('should success with int', async () => {
            let user = await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaaa', status: true, recycle: false })
            let scoreType = await scoreTypeRepository.save({ name: '积分', type: 'int', default: true, description: '用户的积分值' })
            await scoreRepository.save({ name: '积分', value: 1234, scoreType, user })
            let score = await scoreService.getScore(1, 1)
            expect(score).toBe(1234)
        })

        it('should success with float', async () => {
            let user = await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaaa', status: true, recycle: false })
            let scoreType = await scoreTypeRepository.save({ name: '积分', type: 'float', default: true, description: '用户的积分值' })
            await scoreRepository.save({ name: '积分', value: 1234.1234, scoreType, user })
            let score = await scoreService.getScore(1, 1)
            expect(score).toBe(1234.1234)
        })

        it('should throw HttpException:指定id=1积分类型不存在, 427', async () => {
            try {
                let score = await scoreService.getScore(1, 1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(427)
                expect(err.getResponse()).toBe('指定id=1积分类型不存在')
            }
        })

        it('should throw HttpException:指定id=1用户不存在, 428', async () => {
            await scoreTypeRepository.save({ name: '积分', type: 'float', default: true, description: '用户的积分值' })
            try {
                let score = await scoreService.getScore(1, 1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(428)
                expect(err.getResponse()).toBe('指定id=1用户不存在')
            }
        })

        it('should create score with value = 0', async () => {
            let user = await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaaa', status: true, recycle: false })
            let scoreType = await scoreTypeRepository.save({ name: '积分', type: 'int', default: true, description: '用户的积分值' })
            let score1 = await scoreRepository.findOneById(1)
            let score = await scoreService.getScore(1, 1)
            let score2 = await scoreRepository.findOneById(1)
            expect(score1).toBeUndefined()
            expect(score).toBe(0)
            expect(score2).toEqual({ id: 1, name: '积分', value: 0 })
        })

        it('should throw HttpException:数据库错误Error: 创建积分失败, 401', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaaa', status: true, recycle: false })
            await scoreTypeRepository.save({ name: '积分', type: 'int', default: true, description: '用户的积分值' })
            jest.spyOn(scoreRepository,'save').mockImplementationOnce(async ()=>{throw new Error('创建积分失败')})
            try {
                let score = await scoreService.getScore(1, 1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 创建积分失败')
            }
        })

    })



})