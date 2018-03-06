import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { TestingModule } from '@nestjs/testing/testing-module';
import { FuncService } from '../../src/service/FuncService';
import { Permission } from '../../src/model/Permission';
import { Repository, Connection } from 'typeorm';
import { Module } from '../../src/model/Module';
import { Func } from '../../src/model/Func';
import { Test } from '@nestjs/testing';

describe('FuncService', async () => {

    let testModule: TestingModule
    let funcService: FuncService
    let funcRepository: Repository<Func>
    let moduleRepository: Repository<Module>
    let permissionRepository: Repository<Permission>

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, FuncService]
        }).compile()
        funcService = testModule.get<FuncService>(FuncService)
        funcRepository = testModule.get('UserPMModule.FuncRepository')
        moduleRepository = testModule.get('UserPMModule.ModuleRepository')
        permissionRepository = testModule.get('UserPMModule.PermissionRepository')
    })

    beforeEach(async () => {
        let connection: Connection = testModule.get('UserPMModule.Connection')
        if (connection&&!connection.isConnected) {
            await connection.connect()
        }
    })

    afterEach(async () => {
        let connection: Connection = testModule.get('UserPMModule.Connection')
        if (connection&&connection.isConnected) {
            await connection.close()
        }
    })

    afterAll(async () => {
        let connection: Connection = testModule.get('UserPMModule.Connection')
        if (connection&&connection.isConnected) {
            await connection.close()
        }
    })

    describe('createFunc', async () => {

        it('should equal', async () => {
            await moduleRepository.save({ token: 'TestModule' })
            await funcService.createFunc('TestModule', '文章管理')
            let module: Module = await moduleRepository.findOne()
            let func: Func = await funcRepository.findOneById(1)
            expect(module.token).toBe('TestModule')
            expect(func.id).toBe(1)
            expect(func.name).toBe('文章管理')
            expect(func.moduleToken).toBe('TestModule')
        })

        it('should throw HttpException: 指定模块token=aaaa不存在,415', async () => {
            let moduleRepository = { findOneById: async (moduleToken: string): Promise<any> => Promise.resolve(null) }
            let funcService: FuncService = new FuncService({} as any, moduleRepository as any, {} as any)
            try {
                await funcService.createFunc('aaaa', '管理文章')
            } catch (err) {
                expect(err.getStatus()).toBe(415)
                expect(err.getResponse()).toBe('指定模块token=aaaa不存在')
            }
        })

        it('should throw HttpException: 指定模块token=aaaa下，指定名称name=bbbb功能已经存在, 416', async () => {
            let funcRepository = { findOne: async (func: any): Promise<any> => Promise.resolve({ id: 1, name: 'bbbb' }) }
            let moduleRepository = { findOneById: async (moduleToken: string): Promise<any> => Promise.resolve({ token: 'aaaa' }) }
            let funcService: FuncService = new FuncService(funcRepository as any, moduleRepository as any, {} as any)
            try {
                await funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(416)
                expect(err.getResponse()).toBe('指定模块token=aaaa下，指定名称name=bbbb功能已经存在')
            }
        })

        it('should throw HttpException: 数据库错误Error: 保存功能失败, 401', async () => {
            let funcRepository = {
                create: (func: any): any => func,
                findOne: async (func: any): Promise<any> => Promise.resolve(null),
                save: async (func: any): Promise<void> => { throw new Error('保存功能失败') }
            }
            let moduleRepository = { findOneById: async (moduleToken: string): Promise<any> => Promise.resolve({ token: 'aaaa' }) }
            let funcService: FuncService = new FuncService(funcRepository as any, moduleRepository as any, {} as any)
            try {
                await funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存功能失败')
            }
        })
    })

    describe('updateFunc', async () => {

        it('should equal', async () => {
            await moduleRepository.save({ token: 'TestModule' })
            await funcService.createFunc('TestModule', '文章管理')
            let func1: Func = await funcRepository.findOneById(1)
            await funcService.updateFunc(1,'论坛管理')
            let func2: Func = await funcRepository.findOneById(1)
            expect(func1.id).toBe(1)
            expect(func1.name).toBe('文章管理')
            expect(func1.moduleToken).toBe('TestModule')
            expect(func2.id).toBe(1)
            expect(func2.name).toBe('论坛管理')
            expect(func2.moduleToken).toBe('TestModule')
        })

        it('hould throw HttpException: 指定id=1功能不存在, 417', async () => {
            let funcRepository = { findOneById: async (id: number, name: string): Promise<any> => Promise.resolve(null) }
            let funcService: FuncService = new FuncService(funcRepository as any, {} as any, {} as any)
            try {
                await funcService.updateFunc(1, '管理文章')
            } catch (err) {
                expect(err.getStatus()).toBe(417)
                expect(err.getResponse()).toBe('指定id=1功能不存在')
            }
        })
    })
})