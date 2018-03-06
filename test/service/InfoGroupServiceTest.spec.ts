import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { InfoGroupService } from '../../src/service/InfoGroupService';
import { TestingModule } from '@nestjs/testing/testing-module';
import { InfoGroup } from '../../src/model/InfoGroup';
import { InfoItem } from '../../src/model/InfoItem';
import { Repository, Connection } from 'typeorm';
import { Test } from '@nestjs/testing';

describe('FuncService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let infoGroupService: InfoGroupService
    let infoItemRepository: Repository<InfoItem>
    let infoGroupRepository: Repository<InfoGroup>
    let tables = ['info_item', 'info_group']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, InfoGroupService]
        }).compile()
        infoGroupService = testModule.get<InfoGroupService>(InfoGroupService)
        connection = testModule.get('UserPMModule.Connection')
        infoItemRepository = testModule.get('UserPMModule.InfoItemRepository')
        infoGroupRepository = testModule.get('UserPMModule.InfoGroupRepository')
    }, 10000)

    /* 在每个it运行之前都会运行，而不是在这一级包含的每个describe运行之前 */
    beforeEach(async () => {
        await connection.query('delete from infogroup_infoitem')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
    })

    afterAll(async () => {
        await connection.query('delete from function_permission')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    describe('getAll', async () => {

        it('should success', async () => {
            await infoGroupRepository.save([{ name: '基本信息', default: true, status: true }, { name: '认证信息', default: true, status: true }])
            let groups: InfoGroup[] = await infoGroupService.getAll()
            expect(groups).toBeDefined()
            expect(groups.length).toBe(2)
            expect(groups[0]).toEqual({ id: 1, name: '基本信息', default: 1, status: 1 })
            expect(groups[1]).toEqual({ id: 2, name: '认证信息', default: 1, status: 1 })
        })
    })


})