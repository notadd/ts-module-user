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
import * as crypto from 'crypto'

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

    describe('roles', async () => {

        beforeEach(async () => {
            await connection.query('delete from user_role')
            await connection.query('delete from role')
            await connection.query('alter table role auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from user_role')
            await connection.query('delete from role')
            await connection.query('alter table role auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should be array with length is 0', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            let roles = await userService.roles(1)
            expect(roles).toBeDefined()
            expect(roles.length).toBe(0)
        })

        it('should success', async () => {
            await moduleRepository.save({ token: 'aaaa' })
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, roles: [{ name: '文章管理员', score: 80, moduleToken: 'aaaa' }, { name: '后台管理员', score: 80, moduleToken: 'aaaa' }, { name: '论坛管理员', score: 80, moduleToken: 'aaaa' }] })
            let roles = await userService.roles(1)
            expect(roles).toBeDefined()
            expect(roles.length).toBe(3)
            expect(roles[0]).toEqual({ id: 1, name: '文章管理员', score: 80, moduleToken: 'aaaa' })
            expect(roles[1]).toEqual({ id: 2, name: '后台管理员', score: 80, moduleToken: 'aaaa' })
            expect(roles[2]).toEqual({ id: 3, name: '论坛管理员', score: 80, moduleToken: 'aaaa' })
        })
    })

    describe('permissions', async () => {

        beforeEach(async () => {
            await connection.query('delete from user_role')
            await connection.query('delete from role_func')
            await connection.query('delete from function_permission')
            await connection.query('delete from user_adds_permission')
            await connection.query('delete from user_reduces_permission')
            await connection.query('delete from permission')
            await connection.query('alter table permission auto_increment = 1')
            await connection.query('delete from function')
            await connection.query('alter table function auto_increment = 1')
            await connection.query('delete from role')
            await connection.query('alter table role auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
            await connection.query('delete from module')
            await connection.query('alter table module auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from user_role')
            await connection.query('delete from role_func')
            await connection.query('delete from function_permission')
            await connection.query('delete from user_adds_permission')
            await connection.query('delete from user_reduces_permission')
            await connection.query('delete from permission')
            await connection.query('alter table permission auto_increment = 1')
            await connection.query('delete from function')
            await connection.query('alter table function auto_increment = 1')
            await connection.query('delete from role')
            await connection.query('alter table role auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
            await connection.query('delete from module')
            await connection.query('alter table module auto_increment = 1')
        })

        it('should be array with length is 0', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            let pers = await userService.permissions(1)
            expect(pers).toBeDefined()
            expect(pers.length).toBe(0)
        })

        it('when adds and reduces is empty array ,should return roles contain permission', async () => {
            let module = await moduleRepository.save({ token: 'aaaa' })
            let user = await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            let per1 = await permissionRepository.save({ name: '创建文章', description: '创建文章的权限', module })
            let per2 = await permissionRepository.save({ name: '更新文章', description: '更新文章的权限', module })
            let per3 = await permissionRepository.save({ name: '删除文章', description: '删除文章的权限', module })
            let func = await funcRepository.save({ name: '文章管理', module, permissions: [per1, per2, per3] })
            await roleRepository.save({ name: '文章管理员', score: 80, users: [user], module, funcs: [func] })
            let pers = await userService.permissions(1)
            expect(pers).toBeDefined()
            expect(pers.length).toBe(3)
            expect(pers[0]).toEqual({ id: 1, name: '创建文章', description: '创建文章的权限', moduleToken: 'aaaa' })
            expect(pers[1]).toEqual({ id: 2, name: '更新文章', description: '更新文章的权限', moduleToken: 'aaaa' })
            expect(pers[2]).toEqual({ id: 3, name: '删除文章', description: '删除文章的权限', moduleToken: 'aaaa' })
        })

        it('when adds and reduces is exist,should return roles contain permission + adds - reduce', async () => {
            let module = await moduleRepository.save({ token: 'aaaa' })
            let per1 = await permissionRepository.save({ name: '创建文章', description: '创建文章的权限', module })
            let per2 = await permissionRepository.save({ name: '更新文章', description: '更新文章的权限', module })
            let per3 = await permissionRepository.save({ name: '删除文章', description: '删除文章的权限', module })
            let per4 = await permissionRepository.save({ name: '额外文章', description: '额外的权限', module })
            let user = await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, adds: [per4], reduces: [per1] })
            let func = await funcRepository.save({ name: '文章管理', module, permissions: [per1, per2, per3] })
            await roleRepository.save({ name: '文章管理员', score: 80, users: [user], module, funcs: [func] })
            let pers = await userService.permissions(1)
            expect(pers).toBeDefined()
            expect(pers.length).toBe(3)
            expect(pers[0]).toEqual({ id: 2, name: '更新文章', description: '更新文章的权限', moduleToken: 'aaaa' })
            expect(pers[1]).toEqual({ id: 3, name: '删除文章', description: '删除文章的权限', moduleToken: 'aaaa' })
            expect(pers[2]).toEqual({ id: 4, name: '额外文章', description: '额外的权限', moduleToken: 'aaaa' })
        })

        it('should throw HttpException:指定id=1用户不存在, 406', async () => {
            try {
                await userService.permissions(1)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(406)
                expect(err.getResponse()).toBe('指定id=1用户不存在')
            }
        })
    })

    describe('createUser', async () => {

        beforeEach(async () => {
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should success without organization', async () => {
            await userService.createUser(null, '张三', '123456')
            let user = await userRepository.findOneById(1)
            expect(user).toBeDefined()
            expect(user.id).toBe(1)
            expect(user.userName).toBe('张三')
            expect(user.status).toBe(1)
            expect(user.recycle).toBe(0)
            expect(user.password).toBe(crypto.createHash('md5').update('123456' + user.salt).digest('hex'))
        })

        it('should throw HttpException:指定id=1组织不存在, 402', async () => {
            try {
                await userService.createUser(1, '张三', '123456')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1组织不存在')
            }
        })

        it('should throw HttpException:指定userName=张三用户已存在, 406',async ()=>{
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false})
            try {
                await userService.createUser(null, '张三', '123456')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(406)
                expect(err.getResponse()).toBe('指定userName=张三用户已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 创建用户失败, 401',async ()=>{
            jest.spyOn(userRepository,'save').mockImplementationOnce(async ()=>{ throw new Error('创建用户失败')})
            try {
                await userService.createUser(null, '张三', '123456')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 创建用户失败')
            }
        })
    })
})
