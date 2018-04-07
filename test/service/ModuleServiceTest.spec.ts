import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { ModuleService } from '../../src/service/ModuleService';
import { Repository, Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Module } from '../../src/model/Module';
import { Test } from '@nestjs/testing';

describe('FuncService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let moduleService: ModuleService
    let moduleRepository: Repository<Module>
    let tables = ['permission', 'function', 'role', 'module']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, ModuleService]
        }).compile()
        moduleService = testModule.get<ModuleService>(ModuleService)
        connection = testModule.get('UserModule.Connection')
        moduleRepository = testModule.get('UserModule.ModuleRepository')
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
            let modules = await moduleService.getAll()
            expect(modules).toBeDefined()
            expect(modules.length).toBe(0)
        })

        it('should success', async () => {
            await moduleRepository.save({
                token:'aaaa',
                permissions:[
                    {name:'创建文章',description:'创建文章的权限'},
                    {name:'更新文章',description:'更新文章的权限'},
                    {name:'删除文章',description:'删除文章的权限'},
                ],
                funcs:[{name:'管理文章'}],
                roles:[{name:'文章管理员',score:80}]
            })
            let modules:Module[] = await moduleService.getAll()
            expect(modules).toBeDefined()
            expect(modules.length).toBe(1)
            expect(modules[0].token).toBe('aaaa')
            expect(modules[0].permissions).toBeDefined()
            expect(modules[0].permissions.length).toBe(3)
            expect(modules[0].funcs).toBeDefined()
            expect(modules[0].funcs.length).toBe(1)
            expect(modules[0].roles).toBeDefined()
            expect(modules[0].roles.length).toBe(1)
        })
    })
})