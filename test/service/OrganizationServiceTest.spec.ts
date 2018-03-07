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

    describe('deleteOrganization',async ()=>{

        it('should throw HttpException:指定id=1组织不存在, 404', async () => {
            try {
                await organizationService.deleteOrganization(1)
            } catch (err) {
                expect(err.getStatus()).toBe(404)
                expect(err.getResponse()).toBe('指定id=1组织不存在')
            }
        })

        it('should throw HttpException:指定组织存在子组织，无法删除, 404', async () => {
            await organizationRepository.save({ name: '第一集团公司', parentId: null })
            await organizationRepository.save({ name: '跑得快公司', parentId: 1 })
            try {
                await organizationService.deleteOrganization(1)
            } catch (err) {
                expect(err.getStatus()).toBe(404)
                expect(err.getResponse()).toBe('指定组织存在子组织，无法删除')
            }
        })

        it('should throw HttpException:数据库错误Error: 移除组织失败，401', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            jest.spyOn(organizationRepository, 'remove').mockImplementationOnce(async () => { throw new Error('移除组织失败') })
            try {
                await organizationService.deleteOrganization(1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 移除组织失败')
            }
        })
    })

    describe('getUsersInOrganization',async ()=>{

        it('should success',async ()=>{
            await organizationRepository.save({
                name:'集团总公司',
                parentId:null,
                users:[
                    {userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false},
                    {userName:'小米',password:'123456',salt:'bbbbb',status:true,recycle:false}
                ]})
            let users = await organizationService.getUsersInOrganization(1)
            expect(users).toBeDefined()
            expect(users.length).toBe(2)
            expect(users[0]).toEqual({id:1,userName:'老总',password:'123456',salt:'aaaaa',status:1,recycle:0})
            expect(users[1]).toEqual({id:2,userName:'小米',password:'123456',salt:'bbbbb',status:1,recycle:0})            
        })

        it('should throw HttpException:指定id=1父组织不存在, 402',async ()=>{
            try {
                await organizationService.getUsersInOrganization(1)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1父组织不存在')
            }
        })
       
    })

    describe('addUserToOrganization',async ()=>{

        it('should success',async ()=>{
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await userRepository.save({userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false})
            await organizationService.addUserToOrganization(1,1)
            let o = await organizationRepository.findOneById(1,{relations:['users']})
            expect(o.users).toBeDefined()
            expect(o.users.length).toBe(1)
            expect(o.users[0]).toEqual({id:1,userName:'老总',password:'123456',salt:'aaaaa',status:1,recycle:0})
        })

        it('should throw HttpException:指定id=1组织不存在, 402',async ()=>{
            try {
                await organizationService.addUserToOrganization(1,1)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1组织不存在')
            }
        })

        it('should throw HttpException:指定id=1用户不存在, 402',async ()=>{
            await organizationRepository.save({ name: '集团总公司', parentId: null })            
            try {
                await organizationService.addUserToOrganization(1,1)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1用户不存在')
            }
        })

        it('should throw HttpException:指定用户id=1已存在于指定组织id=1中, 402',async ()=>{
            await organizationRepository.save({ name: '集团总公司', parentId: null ,users:[{userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false}]})            
            try {
                await organizationService.addUserToOrganization(1,1)
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定用户id=1已存在于指定组织id=1中')
            }
        })

        it('should throw HttpException:数据库错误Error: 添加用户失败，401', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await userRepository.save({userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false})
            jest.spyOn(organizationRepository, 'save').mockImplementationOnce(async () => { throw new Error('添加用户失败') })
            try {
                await organizationService.addUserToOrganization(1,1)
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 添加用户失败')
            }
        })
    })

    describe('addUsersToOrganization',async ()=>{

        it('should success',async ()=>{
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await userRepository.save({userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false})
            await userRepository.save({userName:'小米',password:'123456',salt:'bbbbb',status:true,recycle:false})
            await organizationService.addUsersToOrganization(1,[1,2])
            let o = await organizationRepository.findOneById(1,{relations:['users']})
            expect(o.users).toBeDefined()
            expect(o.users.length).toBe(2)
            expect(o.users[0]).toEqual({id:1,userName:'老总',password:'123456',salt:'aaaaa',status:1,recycle:0})
            expect(o.users[1]).toEqual({id:2,userName:'小米',password:'123456',salt:'bbbbb',status:1,recycle:0})            
        })

        it('should throw HttpException:指定id=1组织不存在, 402',async ()=>{
            try {
                await organizationService.addUsersToOrganization(1,[1,2])
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1组织不存在')
            }
        })

        it('should throw HttpException:指定id=1用户不存在, 402',async ()=>{
            await organizationRepository.save({ name: '集团总公司', parentId: null })            
            try {
                await organizationService.addUsersToOrganization(1,[1,2])
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1用户不存在')
            }
        })

        it('should throw HttpException:指定用户id=1已存在于指定组织id=1中, 402',async ()=>{
            await organizationRepository.save({ name: '集团总公司', parentId: null ,users:[{userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false}]})            
            try {
                await organizationService.addUsersToOrganization(1,[1])
            } catch (err) {
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定用户id=1已存在于指定组织id=1中')
            }
        })

        it('should throw HttpException:数据库错误Error: 添加用户失败，401', async () => {
            await organizationRepository.save({ name: '集团总公司', parentId: null })
            await userRepository.save({userName:'老总',password:'123456',salt:'aaaaa',status:true,recycle:false})
            jest.spyOn(organizationRepository, 'save').mockImplementationOnce(async () => { throw new Error('添加用户失败') })
            try {
                await organizationService.addUsersToOrganization(1,[1])
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 添加用户失败')
            }
        })
    })

})