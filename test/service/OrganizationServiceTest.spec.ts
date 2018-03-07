import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { OrganizationService } from '../../src/service/OrganizationService';
import { Repository, Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Organization } from '../../src/model/Organization';
import { User } from '../../src/model/User';
import { Test } from '@nestjs/testing';

describe('FuncService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let userRepository: Repository<User>
    let organizationService: OrganizationService
    let organizationRepository: Repository<Organization>
    let tables = ['organization', 'user']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, OrganizationService]
        }).compile()
        connection = testModule.get('UserPMModule.Connection')
        userRepository = testModule.get('UserPMModule.UserRepository')
        organizationService = testModule.get<OrganizationService>(OrganizationService)
        organizationRepository = testModule.get('UserPMModule.OrganizationRepository')
    }, 10000)

    /* 在每个it运行之前都会运行，而不是在这一级包含的每个describe运行之前 */
    beforeEach(async () => {
        await connection.query('delete from organization_user')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
    })

    afterAll(async () => {
        await connection.query('delete from organization_user')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    describe('getRoots', async () => {

        it('should be array with length is 0', async () => {
            let orgs = await organizationService.getRoots()
            expect(orgs).toBeDefined()
            expect(orgs.length).toBe(0)
        })

        it('should success', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await organizationRepository.save({ name: '人力资源部', parentId: 1 })
            await organizationRepository.save({ name: '市场部', parentId: 1 })
            await organizationRepository.save({ name: '经营部', parentId: 1 })
            let orgs = await organizationService.getRoots()
            expect(orgs).toBeDefined()
            expect(orgs.length).toBe(1)
            expect(orgs[0].name).toBe('集团总公司')
        })
    })

    describe('getChildren', async () => {

        it('should success', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await organizationRepository.save({ name: '人力资源部', parentId: 1 })
            await organizationRepository.save({ name: '市场部', parentId: 1 })
            await organizationRepository.save({ name: '经营部', parentId: 1 })
            let orgs = await organizationService.getChildren(1)
            expect(orgs).toBeDefined()
            expect(orgs.length).toBe(3)
            expect(orgs[0]).toEqual({ id: 2, name: '人力资源部', parentId: 1 })
            expect(orgs[1]).toEqual({ id: 3, name: '市场部', parentId: 1 })
            expect(orgs[2]).toEqual({ id: 4, name: '经营部', parentId: 1 })
        })

        it('should throw HttpException:指定父组织id=1不存在, 402', async () => {
            try {
                await organizationService.getChildren(1)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定父组织id=1不存在')
            }
        })
    })

    describe('getAll', async () => {

        it('should be array with length is 0', async () => {
            let orgs = await organizationService.getAll()
            expect(orgs).toBeDefined()
            expect(orgs.length).toBe(0)
        })

        it('should success', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await organizationRepository.save({ name: '人力资源部', parentId: 1 })
            await organizationRepository.save({ name: '市场部', parentId: 1 })
            await organizationRepository.save({ name: '经营部', parentId: 1 })
            let orgs = await organizationService.getAll()
            expect(orgs).toBeDefined()
            expect(orgs.length).toBe(4)
            expect(orgs[0]).toEqual({ id: 1, name: '集团总公司', parentId: null })
            expect(orgs[1]).toEqual({ id: 2, name: '人力资源部', parentId: 1 })
            expect(orgs[2]).toEqual({ id: 3, name: '市场部', parentId: 1 })
            expect(orgs[3]).toEqual({ id: 4, name: '经营部', parentId: 1 })
        })
    })

    describe('createOrganization', async () => {

        it('should succcess', async () => {
            await organizationService.createOrganization('集团公司', null)
            let orgs = await organizationRepository.find()
            expect(orgs).toBeDefined()
            expect(orgs.length).toBe(1)
            expect(orgs[0]).toEqual({ id: 1, name: '集团公司', parentId: null })
        })

        it('should throw HttpException:指定父组织id=1不存在, 402', async () => {
            try {
                await organizationService.createOrganization('集团公司', 1)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定父组织id=1不存在')
            }
        })

        it('should throw HttpException:指定名称name=人力资源部组织已存在, 403', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await organizationRepository.save({ name: '人力资源部', parentId: 1 })
            try {
                await organizationService.createOrganization('人力资源部', 1)
            } catch (err) {
                expect(err.getStatus()).toBe(403)
                expect(err.getResponse()).toBe('指定名称name=人力资源部组织已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 创建组织失败，401', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            jest.spyOn(organizationRepository, 'save').mockImplementationOnce(async () => { throw new Error('创建组织失败') })
            try {
                await organizationService.createOrganization('人力资源部', 1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 创建组织失败')
            }
        })
    })

    describe('updateOrganization', async () => {

        it('should success', async () => {
            await organizationRepository.save({ name: '第一集团公司', parentId: null })
            await organizationRepository.save({ name: '第二集团公司', parentId: null })
            await organizationRepository.save({ name: '跑得快公司', parentId: 1 })
            let o1 = await organizationRepository.findOneById(3)
            await organizationService.updateOrganization(3, '跑得真快公司', 2)
            let o2 = await organizationRepository.findOneById(3)
            expect(o1).toEqual({ id: 3, name: '跑得快公司', parentId: 1 })
            expect(o2).toEqual({ id: 3, name: '跑得真快公司', parentId: 2 })
        })

        it('should throw HttpException:指定id=2组织不存在, 404', async () => {
            await organizationRepository.save({ name: '第一集团公司', parentId: null })
            try {
                await organizationService.updateOrganization(2, '跑得真快公司', 1)
            } catch (err) {
                expect(err.getStatus()).toBe(404)
                expect(err.getResponse()).toBe('指定id=2组织不存在')
            }
        })

        it('should throw HttpException:指定name=跑得真快公司组织已存在，404', async () => {
            await organizationRepository.save({ name: '第一集团公司', parentId: null })
            await organizationRepository.save({ name: '跑得快公司', parentId: 1 })
            await organizationRepository.save({ name: '跑得真快公司', parentId: 1 })
            try {
                await organizationService.updateOrganization(2, '跑得真快公司', 1)
            } catch (err) {
                expect(err.getStatus()).toBe(404)
                expect(err.getResponse()).toBe('指定name=跑得真快公司组织已存在')
            }
        })

        it('should throw HttpException;指定父组织id=3不存在, 402', async () => {
            await organizationRepository.save({ name: '第一集团公司', parentId: null })
            await organizationRepository.save({ name: '跑得快公司', parentId: 1 })
            try {
                await organizationService.updateOrganization(2, '跑得真快公司', 3)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定父组织id=3不存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 更新组织失败，401', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            jest.spyOn(organizationRepository, 'save').mockImplementationOnce(async () => { throw new Error('更新组织失败') })
            try {
                await organizationService.updateOrganization(1,'人力资源部', null)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 更新组织失败')
            }
        })
    })


})