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
            let type1 = { id: 1, name: '贡献', type: 'int', default: true, description: '用户的贡献值' }
            let type2 = { id: 2, name: '积分', type: 'int', default: true, description: '用户的积分值' }
            let type3 = { id: 3, name: '余额', type: 'float', default: true, description: '用户的账户余额' }
            let type4 = { id: 4, name: '威望', type: 'int', default: true, description: '用户的威望值' }
            await scoreTypeRepository.save([type1,type2,type3,type4])
            let types = await scoreTypeService.getAll()
            expect(types).toBeDefined()
            expect(types.length).toBe(4)
            expect(types[0]).toEqual(type1)
            expect(types[1]).toEqual(type2)
            expect(types[2]).toEqual(type3)
            expect(types[3]).toEqual(type4)  
        })

    })

})