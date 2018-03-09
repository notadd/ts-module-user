import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { StoreComponent } from '../../src/interface/StoreComponent';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserService } from '../../src/service/UserService';
import { Organization } from '../../src/model/Organization';
import { Permission } from '../../src/model/Permission';
import { UserInfo } from '../../src/model/UserInfo';
import { Repository, Connection } from 'typeorm';
import { Module } from '../../src/model/Module';
import { HttpException } from '@nestjs/common';
import { User } from '../../src/model/User';
import { Role } from '../../src/model/Role';
import { Func } from '../../src/model/Func';
import { Test } from '@nestjs/testing';


describe('UserService', async () => {

    let testModule: TestingModule
    let connection: Connection
    let userService: UserService
    let storeComponent: StoreComponent
    let userRepository: Repository<User>
    let roleRepository: Repository<Role>
    let funcRepository: Repository<Func>
    let moduleRepository: Repository<Module>
    let userInfoRepository: Repository<UserInfo>
    let permissionRepository: Repository<Permission>
    let organizationRepository: Repository<Organization>

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, UserService]
        }).overrideComponent('StoreComponentToken').useValue({}).compile()
        connection = testModule.get('UserPMModule.Connection')
        userService = testModule.get<UserService>(UserService)
        storeComponent = testModule.get('StoreComponentToken')
        userRepository = testModule.get('UserPMModule.UserRepository')
        roleRepository = testModule.get('UserPMModule.RoleRepository')
        funcRepository = testModule.get('UserPMModule.FuncRepository')
        moduleRepository = testModule.get('UserPMModule.ModuleRepository')
        userInfoRepository = testModule.get('UserPMModule.UserInfoRepository')
        permissionRepository = testModule.get('UserPMModule.PermissionRepository')
        organizationRepository = testModule.get('UserPMModule.OrganizationRepository')
    }, 10000)

    afterAll(async () => {
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    describe('getAll', async () => {

        beforeEach(async () => {
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should be array with length is 0', async () => {
            let users = await userService.getAll()
            expect(users).toBeDefined()
            expect(users.length).toBe(0)
        })

        it('should success', async () => {
            await userRepository.save([
                { userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false },
                { userName: '李四', password: '654321', salt: 'bbbbb', status: true, recycle: false },
                { userName: '王五', password: '321456', salt: 'ccccc', status: true, recycle: false },
                { userName: '牛六', password: '654123', salt: 'ddddd', status: true, recycle: false }
            ])
            let users = await userService.getAll()
            expect(users).toBeDefined()
            expect(users.length).toBe(4)
            expect(users[0]).toEqual({ id: 1, userName: '张三', password: '123456', salt: 'aaaaa', status: 1, recycle: 0 })
            expect(users[1]).toEqual({ id: 2, userName: '李四', password: '654321', salt: 'bbbbb', status: 1, recycle: 0 })
            expect(users[2]).toEqual({ id: 3, userName: '王五', password: '321456', salt: 'ccccc', status: 1, recycle: 0 })
            expect(users[3]).toEqual({ id: 4, userName: '牛六', password: '654123', salt: 'ddddd', status: 1, recycle: 0 })
        })

        it('the user with recycle is true not return', async () => {
            await userRepository.save([
                { userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false },
                { userName: '李四', password: '654321', salt: 'bbbbb', status: true, recycle: true },
                { userName: '王五', password: '321456', salt: 'ccccc', status: true, recycle: false },
                { userName: '牛六', password: '654123', salt: 'ddddd', status: true, recycle: false }
            ])
            let users = await userService.getAll()
            expect(users).toBeDefined()
            expect(users.length).toBe(3)
            expect(users[0]).toEqual({ id: 1, userName: '张三', password: '123456', salt: 'aaaaa', status: 1, recycle: 0 })
            expect(users[1]).toEqual({ id: 3, userName: '王五', password: '321456', salt: 'ccccc', status: 1, recycle: 0 })
            expect(users[2]).toEqual({ id: 4, userName: '牛六', password: '654123', salt: 'ddddd', status: 1, recycle: 0 })
        })
    })

    describe('getFreedomUsers', async () => {

        beforeEach(async () => {
            await connection.query('delete from organization_user')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
            await connection.query('delete from organization')
            await connection.query('alter table organization auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from organization_user')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
            await connection.query('delete from organization')
            await connection.query('alter table organization auto_increment = 1')
        })

        it('should be array with length is 0', async () => {
            let users = await userService.getFreedomUsers()
            expect(users).toBeDefined()
            expect(users.length).toBe(0)
        })

        it('should success', async () => {
            let o = await organizationRepository.save({ name: '跑得快公司' })
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, organizations: [o] })
            await userRepository.save({ userName: '李四', password: '654321', salt: 'bbbbb', status: true, recycle: false, organizations: [o] })
            await userRepository.save({ userName: '王五', password: '321456', salt: 'ccccc', status: true, recycle: false })
            await userRepository.save({ userName: '牛六', password: '654123', salt: 'ddddd', status: true, recycle: false })
            let users = await userService.getFreedomUsers()
            expect(users).toBeDefined()
            expect(users.length).toBe(2)
            expect(users[0]).toEqual({ id: 3, userName: '王五', password: '321456', salt: 'ccccc', status: 1, recycle: 0, organizations: [] })
            expect(users[1]).toEqual({ id: 4, userName: '牛六', password: '654123', salt: 'ddddd', status: 1, recycle: 0, organizations: [] })
        })

        it('the user with recycle is true not return', async () => {
            let o = await organizationRepository.save({ name: '跑得快公司' })
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, organizations: [o] })
            await userRepository.save({ userName: '李四', password: '654321', salt: 'bbbbb', status: true, recycle: false, organizations: [o] })
            await userRepository.save({ userName: '王五', password: '321456', salt: 'ccccc', status: true, recycle: true })
            await userRepository.save({ userName: '牛六', password: '654123', salt: 'ddddd', status: true, recycle: false })
            let users = await userService.getFreedomUsers()
            expect(users).toBeDefined()
            expect(users.length).toBe(1)
            expect(users[0]).toEqual({ id: 4, userName: '牛六', password: '654123', salt: 'ddddd', status: 1, recycle: 0, organizations: [] })
        })
    })

    describe('getRecycleUsers', async () => {

        beforeEach(async () => {
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should be array with length is 0', async () => {
            let users = await userService.getRecycleUsers()
            expect(users).toBeDefined()
            expect(users.length).toBe(0)
        })

        it('should success', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            await userRepository.save({ userName: '李四', password: '654321', salt: 'bbbbb', status: true, recycle: false })
            await userRepository.save({ userName: '王五', password: '321456', salt: 'ccccc', status: true, recycle: true })
            await userRepository.save({ userName: '牛六', password: '654123', salt: 'ddddd', status: true, recycle: true })
            let users = await userService.getRecycleUsers()
            expect(users).toBeDefined()
            expect(users.length).toBe(2)
            expect(users[0]).toEqual({ id: 3, userName: '王五', password: '321456', salt: 'ccccc', status: 1, recycle: 1 })
            expect(users[1]).toEqual({ id: 4, userName: '牛六', password: '654123', salt: 'ddddd', status: 1, recycle: 1 })
        })
    })

    describe('userInfos', async () => {

        beforeEach(async () => {
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should be array with length is 0', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            let userInfos = await userService.userInfos(1)
            expect(userInfos).toBeDefined()
            expect(userInfos.length).toBe(0)
        })

        it('should success', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, userInfos: [{ key: 'nickname', value: '三儿' }, { key: 'age', value: '22' }, { key: 'birthday', value: '1992-02-22' }] })
            let userInfos = await userService.userInfos(1)
            expect(userInfos).toBeDefined()
            expect(userInfos.length).toBe(3)
            expect(userInfos[0]).toEqual({ id: 1, key: 'nickname', value: '三儿', userId: 1 })
            expect(userInfos[1]).toEqual({ id: 2, key: 'age', value: '22', userId: 1 })
            expect(userInfos[2]).toEqual({ id: 3, key: 'birthday', value: '1992-02-22', userId: 1 })
        })

    })
})
