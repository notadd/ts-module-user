import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { InfoItemService } from '../../src/service/InfoItemService';
import { TestingModule } from '@nestjs/testing/testing-module';
import { InfoItem } from '../../src/model/InfoItem';
import { Repository, Connection } from 'typeorm';
import { Test } from '@nestjs/testing';

describe('FuncService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let infoItemService: InfoItemService
    let infoItemRepository: Repository<InfoItem>
    let tables = ['info_item']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, InfoItemService]
        }).compile()
        infoItemService = testModule.get<InfoItemService>(InfoItemService)
        connection = testModule.get('UserPMModule.Connection')
        infoItemRepository = testModule.get('UserPMModule.InfoItemRepository')
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

    describe('createInfoItem', async () => {

        it('should success', async () => {
            await infoItemService.createInfoItem('userName', '用户名', '用户的名称', 'text', true, 1)
            let item = await infoItemRepository.findOne()
            expect(item).toEqual({ id: 1, name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: 1, order: 1, default: 0 })
        })

        it('should throw HttpException:指定名称信息项已存在：userName, 412', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, order: 1, default: false })
            try {
                await infoItemService.createInfoItem('userName', '用户名', '用户的名称', 'text', true, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(412)
                expect(err.getResponse()).toBe('指定名称信息项已存在：userName')
            }
        })

        it('should throw HttpException:数据库错误Error: 创建信息项失败，401', async () => {
            jest.spyOn(infoItemRepository, 'save').mockImplementationOnce(async () => { throw new Error('创建信息项失败') })
            try {
                await infoItemService.createInfoItem('userName', '用户名', '用户的名称', 'text', true, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 创建信息项失败')
            }
        })
    })

})
