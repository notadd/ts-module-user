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
    }, 10000)
    /* 在每个it运行之前都会运行，而不是在这一级包含的每个describe运行之前 */
    beforeEach(async () => {
        let connection: Connection = testModule.get('UserPMModule.Connection')
        if (connection && !connection.isConnected) {
            let start = +new Date()
            await connection.connect()
            let end = +new Date()
            console.log('连接数据库花费时间' + (end - start) + '毫秒')
        }
    }, 10000)

    afterEach(async () => {
        let connection: Connection = testModule.get('UserPMModule.Connection')
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    afterAll(async () => {
        let connection: Connection = testModule.get('UserPMModule.Connection')
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })
    /* createFunc方法的一种正常情况，以及三种异常情况 */
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
            try {
                await funcService.createFunc('aaaa', '管理文章')
            } catch (err) {
                expect(err.getStatus()).toBe(415)
                expect(err.getResponse()).toBe('指定模块token=aaaa不存在')
            }
        })

        it('should throw HttpException: 指定模块token=aaaa下，指定名称name=bbbb功能已经存在, 416', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            await funcRepository.save({ name: 'bbbb', moduleToken: 'aaaa' })
            try {
                await funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(416)
                expect(err.getResponse()).toBe('指定模块token=aaaa下，指定名称name=bbbb功能已经存在')
            }
        })

        it('should throw HttpException: 数据库错误Error: 保存功能失败, 401', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            jest.spyOn(funcRepository, 'save').mockImplementationOnce(async () => { throw new Error('保存功能失败') })
            try {
                await funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存功能失败')
            }
        })
    })
    /* 一种正常情况与三种异常情况 */
    describe('updateFunc', async () => {

        it('should equal', async () => {
            await moduleRepository.save({ token: 'TestModule' })
            await funcRepository.save({ name: '文章管理', moduleToken: 'TestModule' })
            let func1: Func = await funcRepository.findOneById(1)
            await funcService.updateFunc(1, '论坛管理')
            let func2: Func = await funcRepository.findOneById(1)
            expect(func1.id).toBe(1)
            expect(func1.name).toBe('文章管理')
            expect(func1.moduleToken).toBe('TestModule')
            expect(func2.id).toBe(1)
            expect(func2.name).toBe('论坛管理')
            expect(func2.moduleToken).toBe('TestModule')
        })

        it('should throw HttpException: 指定id=1功能不存在, 417', async () => {
            try {
                await funcService.updateFunc(1, '管理文章')
            } catch (err) {
                expect(err.getStatus()).toBe(417)
                expect(err.getResponse()).toBe('指定id=1功能不存在')
            }
        })

        it('should throw HttpException: 指定模块token=aaaa下，指定名称name=论坛管理功能已经存在, 416', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            await funcRepository.save([{ name: '管理文章', moduleToken: 'aaaa' }, { name: '论坛管理', moduleToken: 'aaaa' }])
            try {
                await funcService.updateFunc(1, '论坛管理')
            } catch (err) {
                expect(err.getStatus()).toBe(416)
                expect(err.getResponse()).toBe('指定模块token=aaaa下，指定名称name=论坛管理功能已经存在')
            }
        })

        it('should throw HttpException: 数据库错误Error: 更新功能失败, 401', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            await funcRepository.save({ name: '管理文章', moduleToken: 'aaaa' })
            jest.spyOn(funcRepository, 'save').mockImplementationOnce(async () => { throw new Error('更新功能失败') })
            try {
                await funcService.updateFunc(1, '论坛管理')
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 更新功能失败')
            }
        })
    })

    describe('deleteFunc', async () => {

        it('should success ', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            await funcRepository.save({ name: '文章管理', moduleToken: 'aaaa' })
            await funcService.deleteFunc(1)
            let func = await funcRepository.findOne()
            expect(func).toBeUndefined()
        })

        it('should throw HttpException:指定id=1功能不存在, 417', async () => {
            try {
                await funcService.deleteFunc(1)
            } catch (err) {
                expect(err.getStatus()).toBe(417)
                expect(err.getResponse()).toBe('指定id=1功能不存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 删除功能失败, 401', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            await funcRepository.save({ name: '文章管理', moduleToken: 'aaaa' })
            jest.spyOn(funcRepository, 'remove').mockImplementationOnce(async () => { throw new Error('删除功能失败') })
            try {
                await funcService.deleteFunc(1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 删除功能失败')
            }
        })

    })
})