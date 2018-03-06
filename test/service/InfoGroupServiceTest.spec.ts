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
        console.log('文件一')
        await connection.query('delete from infogroup_infoitem')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
        let end = +new Date()
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

    it('1', async () => {

    })

    it('2', async () => {

    })


    it('3', async () => {

    })


    it('4', async () => {

    })


})