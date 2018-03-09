import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { ScoreTypeService } from '../../src/service/ScoreTypeService';
import { TestingModule } from '@nestjs/testing/testing-module';
import { ScoreType } from '../../src/model/ScoreType';
import { Repository, Connection } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';


describe('ScoreTypeService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let scoreTypeService: ScoreTypeService
    let scoreTypeRepository: Repository<ScoreType>
    let tables = ['score_type']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, ScoreTypeService]
        }).compile()
        connection = testModule.get('UserPMModule.Connection')
        scoreTypeService = testModule.get<ScoreTypeService>(ScoreTypeService)
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

    describe('getAll', async () => {

        it('should be array with length is 0', async () => {
            let types: ScoreType[] = await scoreTypeService.getAll()
            expect(types).toBeDefined()
            expect(types.length).toBe(0)
        })

        it('should success', async () => {
            let scoreTypes = [
                { name: '贡献', type: 'int', default: true, description: '用户的贡献值' },
                { name: '积分', type: 'int', default: true, description: '用户的积分值' },
                { name: '余额', type: 'float', default: true, description: '用户的账户余额' },
                { name: '威望', type: 'int', default: true, description: '用户的威望值' }
            ]
            await scoreTypeRepository.save(scoreTypes)
            scoreTypes.forEach((value: any, index) => { value.id = index + 1; value.default = 1 })
            let types = await scoreTypeService.getAll()
            expect(types).toBeDefined()
            expect(types.length).toBe(4)
            expect(types[0]).toEqual(scoreTypes[0])
            expect(types[1]).toEqual(scoreTypes[1])
            expect(types[2]).toEqual(scoreTypes[2])
            expect(types[3]).toEqual(scoreTypes[3])
        })

    })

    describe('createScoreType', async () => {

        it('should success', async () => {
            await scoreTypeService.createScoreType('积分', 'int', '用户的积分')
            let type = await scoreTypeRepository.findOneById(1)
            expect(type).toEqual({ id: 1, name: '积分', type: 'int', default: 0, description: '用户的积分' })
        })

        it('should throw HttpException:指定名称name=贡献积分类型已存在,424', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: true, description: '用户的贡献值' })
            try {
                await scoreTypeService.createScoreType('贡献', 'int', '用户的贡献')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(424)
                expect(err.getResponse()).toBe('指定名称name=贡献积分类型已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 保存积分类型失败，401', async () => {
            jest.spyOn(scoreTypeRepository, 'save').mockImplementationOnce(async () => { throw new Error('保存积分类型失败') })
            try {
                await scoreTypeService.createScoreType('贡献', 'int', '用户的贡献')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存积分类型失败')
            }
        })
    })

    describe('updateScoreType', async () => {

        it('should success', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            let type1 = await scoreTypeRepository.findOneById(1)
            await scoreTypeService.updateScoreType(1, '积分', 'float', '用户的积分值')
            let type2 = await scoreTypeRepository.findOneById(1)
            expect(type1).toEqual({ id: 1, name: '贡献', type: 'int', default: 0, description: '用户的贡献值' })
            expect(type2).toEqual({ id: 1, name: '积分', type: 'float', default: 0, description: '用户的积分值' })
        })

        it('should throw HttpException:指定id=1积分类型不存在, 425', async () => {
            try {
                await scoreTypeService.updateScoreType(1, '贡献', 'int', '用户的贡献')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(425)
                expect(err.getResponse()).toBe('指定id=1积分类型不存在')
            }
        })

        it('should throw HttpException:默认积分类型不允许更改, 426', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: true, description: '用户的贡献值' })
            try {
                await scoreTypeService.updateScoreType(1, '贡献', 'int', '用户的贡献')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(426)
                expect(err.getResponse()).toBe('默认积分类型不允许更改')
            }
        })

        it('should throw HttpException:指定名称name=积分积分类型已存在, 424', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            await scoreTypeRepository.save({ id: 2, name: '积分', type: 'int', default: false, description: '用户的贡献值' })
            try {
                await scoreTypeService.updateScoreType(1, '积分', 'int', '用户的贡献')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(424)
                expect(err.getResponse()).toBe('指定名称name=积分积分类型已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 更新积分类型失败，401', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            jest.spyOn(scoreTypeRepository, 'save').mockImplementationOnce(async () => { throw new Error('更新积分类型失败') })
            try {
                await scoreTypeService.updateScoreType(1, '积分', 'int', '用户的贡献')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 更新积分类型失败')
            }
        })

    })

    describe('deleteScoreType', async () => {

        it('should success', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            await scoreTypeService.deleteScoreType(1)
            let types = await scoreTypeRepository.find()
            expect(types).toBeDefined()
            expect(types.length).toBe(0)
        })

        it('should throw HttpException:指定id=1积分类型不存在, 425', async () => {
            try {
                await scoreTypeService.deleteScoreType(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(425)
                expect(err.getResponse()).toBe('指定id=1积分类型不存在')
            }
        })

        it('should throw HttpException:默认积分类型不允许删除，426', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: true, description: '用户的贡献值' })
            try {
                await scoreTypeService.deleteScoreType(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(426)
                expect(err.getResponse()).toBe('默认积分类型不允许删除')
            }
        })


        it('should throw HttpException:数据库错误Error: 删除积分类型失败，401', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            jest.spyOn(scoreTypeRepository, 'remove').mockImplementationOnce(async () => { throw new Error('删除积分类型失败') })
            try {
                await scoreTypeService.deleteScoreType(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 删除积分类型失败')
            }
        })

    })

    describe('deleteScoreTypes', async () => {

        it('should success', async () => {
            let scoreTypes = [
                { name: '贡献', type: 'int', default: false, description: '用户的贡献值' },
                { name: '积分', type: 'int', default: false, description: '用户的积分值' },
                { name: '余额', type: 'float', default: false, description: '用户的账户余额' },
                { name: '威望', type: 'int', default: false, description: '用户的威望值' }
            ]
            await scoreTypeRepository.save(scoreTypes)
            await scoreTypeService.deleteScoreTypes([1,2,3,4])
            let types = await scoreTypeRepository.find()
            expect(types).toBeDefined()
            expect(types.length).toBe(0)
        })

        it('should throw HttpException:指定id=2积分类型不存在, 425',async ()=>{
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            try {
                await scoreTypeService.deleteScoreTypes([1,2,3])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(425)
                expect(err.getResponse()).toBe('指定id=2积分类型不存在')
            }          
        })

        it('should throw HttpException:默认积分类型不允许删除, 426',async ()=>{
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            await scoreTypeRepository.save({ id: 1, name: '积分', type: 'int', default: true, description: '用户的积分值' }) 
            try {
                await scoreTypeService.deleteScoreTypes([1,2,3])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(426)
                expect(err.getResponse()).toBe('默认积分类型不允许删除')
            }          
        })

        it('should throw HttpException:数据库错误Error: 删除积分类型失败，401', async () => {
            await scoreTypeRepository.save({ id: 1, name: '贡献', type: 'int', default: false, description: '用户的贡献值' })
            jest.spyOn(scoreTypeRepository, 'remove').mockImplementationOnce(async () => { throw new Error('删除积分类型失败') })
            try {
                await scoreTypeService.deleteScoreTypes([1])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 删除积分类型失败')
            }
        })
    })
})