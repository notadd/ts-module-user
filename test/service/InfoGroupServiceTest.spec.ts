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

    describe('getItems', async () => {

        it('should success', async () => {
            let name = { name: 'userName', label: '用户名', default: 1, description: '用户的名字', type: 'text', necessary: 1, order: 1 }
            let age = { name: 'age', label: '年龄', default: 1, description: '用户的年龄', type: 'number', necessary: 1, order: 2 }
            let sign = { name: 'sign', label: '签名', default: 1, description: '用户的签名', type: 'textarea', necessary: 1, order: 3 }
            await infoGroupRepository.save({ name: '基本信息', default: true, status: true, items: [name, age, sign] })
            let items = await infoGroupService.getInfoItems(1)
            expect(items).toBeDefined()
            expect(items.length).toBe(3)
            expect(items[0].id).toBe(1)
            expect(items[1].id).toBe(2)
            expect(items[2].id).toBe(3)
            expect(items[0]).toEqual(name)
            expect(items[1]).toEqual(age)
            expect(items[2]).toEqual(sign)
        })
    })

    describe('createInfoGroup', async () => {

        it('should success', async () => {
            await infoGroupService.createInfoGroup('基本信息')
            let group = await infoGroupRepository.findOne()
            expect(group).toEqual({ id: 1, name: '基本信息', default: 0, status: 1 })
        })

        it('should throw HttpException:给定名称name=基本信息信息组已存在, 407', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: true, status: true })
            try {
                await infoGroupService.createInfoGroup('基本信息')
            } catch (err) {
                expect(err.getStatus()).toBe(407)
                expect(err.getResponse()).toBe('给定名称name=基本信息信息组已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 保存信息组错误，401', async () => {
            jest.spyOn(infoGroupRepository, 'save').mockImplementationOnce(async () => { throw new Error('保存信息组错误') })
            try {
                await infoGroupService.createInfoGroup('基本信息')
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存信息组错误')
            }
        })
    })

    describe('updateInfoGroup', async () => {

        it('should success', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            await infoGroupService.updateInfoGroup(1, '认证信息')
            let group = await infoGroupRepository.findOne()
            expect(group).toEqual({ id: 1, name: '认证信息', default: 0, status: 1 })
        })

        it('should throw HttpException:给定id=1信息组不存在, 408', async () => {
            try {
                await infoGroupService.updateInfoGroup(1, '基本信息')
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('给定id=1信息组不存在')
            }
        })

        it('should throw HttpException:默认信息组不可更改, 408', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: true, status: true })
            try {
                await infoGroupService.updateInfoGroup(1, '认证信息')
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('默认信息组不可更改')
            }
        })

        it('should throw HttpException:指定名称信息组已存在：认证信息, 408', async () => {
            await infoGroupRepository.save([{ name: '基本信息', default: false, status: true }, { name: '认证信息', default: false, status: true }])
            try {
                await infoGroupService.updateInfoGroup(1, '认证信息')
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('指定名称信息组已存在：认证信息')
            }
        })

        it('should throw HttpException:数据库错误Error: 更新信息组错误，401', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            jest.spyOn(infoGroupRepository, 'save').mockImplementationOnce(async () => { throw new Error('更新信息组错误') })
            try {
                await infoGroupService.updateInfoGroup(1, '认证信息')
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 更新信息组错误')
            }
        })
    })

    describe('deleteInfoGroup', async () => {

        it('should success', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            await infoGroupService.deleteInfoGroup(1)
            let group = await infoItemRepository.findOne()
            expect(group).toBeUndefined()
        })

        it('should throw HttpException:给定id=1信息组不存在, 408', async () => {
            try {
                await infoGroupService.deleteInfoGroup(1)
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('给定id=1信息组不存在')
            }
        })

        it('should throw HttpException:默认信息组不可删除, 408', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: true, status: true })
            try {
                await infoGroupService.deleteInfoGroup(1)
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('默认信息组不可删除')
            }
        })

        it('should throw HttpException:数据库错误Error: 删除信息组错误，401', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            jest.spyOn(infoGroupRepository, 'remove').mockImplementationOnce(async () => { throw new Error('删除信息组错误') })
            try {
                await infoGroupService.deleteInfoGroup(1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 删除信息组错误')
            }
        })
    })

    describe('addInfoItem', async () => {

        it('should success', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', default: false, description: '用户的名字', type: 'text', necessary: true, order: 1 })
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            await infoGroupService.addInfoItem(1, 1)
            let group = await infoGroupRepository.findOneById(1, { relations: ['items'] })
            expect(group.items).toBeDefined()
            expect(group.items.length).toBe(1)
            expect(group.items[0]).toEqual({ id: 1, name: 'userName', label: '用户名', default: 0, description: '用户的名字', type: 'text', necessary: 1, order: 1 })
        })

        it('should throw HttpException:给定id=1信息组不存在, 408', async () => {
            try {
                await infoGroupService.addInfoItem(1, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('给定id=1信息组不存在')
            }
        })

        it('should throw HttpException:默认信息组不可更改, 408', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: true, status: true })
            try {
                await infoGroupService.addInfoItem(1, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('默认信息组不可更改')
            }
        })

        it('should throw HttpException:指定id=1信息项不存在, 409', async () => {
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            try {
                await infoGroupService.addInfoItem(1, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(409)
                expect(err.getResponse()).toBe('指定id=1信息项不存在')
            }
        })

        it('should throw HttpException:默认信息项不可添加, 408', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', default: true, description: '用户的名字', type: 'text', necessary: true, order: 1 })
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            try {
                await infoGroupService.addInfoItem(1, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('默认信息项不可添加')
            }
        })

        it('should throw HttpException:指定信息项id=1已经存在于指定信息组id=1中, 410', async () => {
            let item = { id: 1, name: 'userName', label: '用户名', default: false, description: '用户的名字', type: 'text', necessary: true, order: 1 }
            await infoItemRepository.save(item)
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true, items: [item] })
            try {
                await infoGroupService.addInfoItem(1, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定信息项id=1已经存在于指定信息组id=1中')
            }
        })

        it('should throw HttpException:数据库错误Error: 添加信息项错误，401', async () => {
            await infoItemRepository.save({ name: 'userName', label: '用户名', default: false, description: '用户的名字', type: 'text', necessary: true, order: 1 })
            await infoGroupRepository.save({ name: '基本信息', default: false, status: true })
            jest.spyOn(infoGroupRepository, 'save').mockImplementationOnce(async () => { throw new Error('添加信息项错误') })
            try {
                await infoGroupService.addInfoItem(1, 1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 添加信息项错误')
            }
        })
    })
})