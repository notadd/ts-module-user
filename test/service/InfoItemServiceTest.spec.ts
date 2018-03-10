import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { InfoItemService } from '../../src/service/InfoItemService';
import { TestingModule } from '@nestjs/testing/testing-module';
import { InfoItem } from '../../src/model/InfoItem';
import { Repository, Connection } from 'typeorm';
import { HttpException } from '@nestjs/common';
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
        await connection.query('delete from ' + tables[0])
        await connection.query('alter table ' + tables[0] + ' auto_increment = 1')
    })

    afterAll(async () => {
        await connection.query('delete from ' + tables[0])
        await connection.query('alter table ' + tables[0] + ' auto_increment = 1')
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    describe('createInfoItem', async () => {

        it('should success', async () => {
            await infoItemService.createInfoItem('userName', '用户名', '用户的名称', 'text', true, true, true, 1)
            let item = await infoItemRepository.findOne()
            expect(item).toEqual({ id: 1, name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: 1, registerVisible: 1, informationVisible: 1, order: 1, default: 0 })
        })

        it('should throw HttpException:指定名称信息项已存在：userName, 412', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, order: 1, default: false })
            try {
                await infoItemService.createInfoItem('userName', '用户名', '用户的名称', 'text', true, true, true, 1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(412)
                expect(err.getResponse()).toBe('指定名称信息项已存在：userName')
            }
        })

        it('should throw HttpException:数据库错误Error: 创建信息项失败，401', async () => {
            jest.spyOn(infoItemRepository, 'save').mockImplementationOnce(async () => { throw new Error('创建信息项失败') })
            try {
                await infoItemService.createInfoItem('userName', '用户名', '用户的名称', 'text', true, true, true, 1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 创建信息项失败')
            }
        })
    })

    describe('updateInfoItem', async () => {

        it('should success', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            let name = await infoItemRepository.findOne()
            await infoItemService.updateInfoItem(1, 'password', '密码', '用户的密码', 'text', false, true, true, 2)
            let password = await infoItemRepository.findOne()
            expect(name).toEqual({ id: 1, name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: 1, registerVisible: 1, informationVisible: 1, order: 1, default: 0 })
            expect(password).toEqual({ id: 1, name: 'password', label: '密码', description: '用户的密码', type: 'text', necessary: 0, registerVisible: 1, informationVisible: 1, order: 2, default: 0 })
        })

        it('should throw HttpException:指定id=1信息项不存在, 413', async () => {
            try {
                await infoItemService.updateInfoItem(1, 'password', '密码', '用户的密码', 'text', false, true, true, 2)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(413)
                expect(err.getResponse()).toBe('指定id=1信息项不存在')
            }
        })

        it('should throw HttpException:默认信息项不允许更新, 413', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: true })
            try {
                await infoItemService.updateInfoItem(1, 'password', '密码', '用户的密码', 'text', false, true, true, 2)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(413)
                expect(err.getResponse()).toBe('默认信息项不允许更新')
            }
        })

        it('should throw HttpException:指定name=password信息项已存在, 412', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            await infoItemRepository.save({ name: 'password', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            try {
                await infoItemService.updateInfoItem(1, 'password', '密码', '用户的密码', 'text', false, true, true, 2)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(412)
                expect(err.getResponse()).toBe('指定name=password信息项已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 更新信息项失败，401', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            jest.spyOn(infoItemRepository, 'save').mockImplementationOnce(async () => { throw new Error('更新信息项失败') })
            try {
                await infoItemService.updateInfoItem(1, 'password', '密码', '用户的密码', 'text', false, true, true, 2)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 更新信息项失败')
            }
        })

    })

    describe('deleteInfoItem', async () => {

        it('should success', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            let items1 = await infoItemRepository.find()
            await infoItemService.deleteInfoItem(1)
            let items2 = await infoItemRepository.find()
            expect(items1).toBeDefined()
            expect(items1.length).toBe(1)
            expect(items2).toBeDefined()
            expect(items2.length).toBe(0)
        })

        it('should throw HttpException:指定id=1信息项不存在, 413', async () => {
            try {
                await infoItemService.deleteInfoItem(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(413)
                expect(err.getResponse()).toBe('指定id=1信息项不存在')
            }
        })

        it('should throw HttpException:默认信息项不允许删除, 413', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: true })
            try {
                await infoItemService.deleteInfoItem(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(413)
                expect(err.getResponse()).toBe('默认信息项不允许删除')
            }
        })

        it('should throw HttpException:数据库错误Error: 删除信息项失败，401', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            jest.spyOn(infoItemRepository, 'remove').mockImplementationOnce(async () => { throw new Error('删除信息项失败') })
            try {
                await infoItemService.deleteInfoItem(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 删除信息项失败')
            }
        })
    })

    describe('deleteInfoItems', async () => {

        it('should success', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            await infoItemRepository.save({ name: 'password', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            let items1 = await infoItemRepository.find()
            await infoItemService.deleteInfoItems([1, 2])
            let items2 = await infoItemRepository.find()
            expect(items1).toBeDefined()
            expect(items1.length).toBe(2)
            expect(items2).toBeDefined()
            expect(items2.length).toBe(0)
        })

        it('should throw HttpException:指定id=1信息项不存在, 413', async () => {
            try {
                await infoItemService.deleteInfoItems([1, 2])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(413)
                expect(err.getResponse()).toBe('指定id=1信息项不存在')
            }
        })

        it('should throw HttpException:默认信息项不允许删除, 413', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: true })
            await infoItemRepository.save({ name: 'password', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            try {
                await infoItemService.deleteInfoItems([1, 2])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(413)
                expect(err.getResponse()).toBe('默认信息项不允许删除')
            }
        })

        it('should throw HttpException:数据库错误Error: 删除信息项失败，401', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            await infoItemRepository.save({ name: 'password', label: '用户名', description: '用户的名称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1, default: false })
            jest.spyOn(infoItemRepository, 'remove').mockImplementationOnce(async () => { throw new Error('删除信息项失败') })
            try {
                await infoItemService.deleteInfoItems([1, 2])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 删除信息项失败')
            }
        })

    })

})
