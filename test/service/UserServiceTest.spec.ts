import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { StoreComponent } from '../../src/interface/StoreComponent';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserService } from '../../src/service/UserService';
import { Organization } from '../../src/model/Organization';
import { Permission } from '../../src/model/Permission';
import { InfoGroup } from '../../src/model/InfoGroup';
import { InfoItem } from '../../src/model/InfoItem';
import { UserInfo } from '../../src/model/UserInfo';
import { Repository, Connection } from 'typeorm';
import { Module } from '../../src/model/Module';
import { HttpException } from '@nestjs/common';
import { User } from '../../src/model/User';
import { Role } from '../../src/model/Role';
import { Func } from '../../src/model/Func';
import { Test } from '@nestjs/testing';
import * as crypto from 'crypto'
import { watch } from 'fs';

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
    let infoItemRepository: Repository<InfoItem>
    let infoGroupRepository: Repository<InfoGroup>
    let permissionRepository: Repository<Permission>
    let organizationRepository: Repository<Organization>

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, UserService]
        }).overrideComponent('StoreComponentToken').useValue({
            cache: {},
            async delete(bucketName: string, name: string, type: string): Promise<void> {
                this.cache[bucketName][name][type] = undefined
            },
            async upload(bucketName: string, rawName: string, base64: string, imagePreProcessInfo: any): Promise<{ bucketName: string, name: string, type: string }> {
                let [name, type] = rawName.split('.')
                this.cache[bucketName] = { [name]: { [type]: base64 } }
                return { bucketName, name, type }
            },
            async getUrl(req: any, bucketName: string, name: string, type: string, imageProcessInfo: any): Promise<string> {
                return 'http://localhost:8080/' + bucketName + '/' + name + '.' + type
            }
        }).compile()
        connection = testModule.get('UserPMModule.Connection')
        userService = testModule.get<UserService>(UserService)
        storeComponent = testModule.get('StoreComponentToken')
        userRepository = testModule.get('UserPMModule.UserRepository')
        roleRepository = testModule.get('UserPMModule.RoleRepository')
        funcRepository = testModule.get('UserPMModule.FuncRepository')
        moduleRepository = testModule.get('UserPMModule.ModuleRepository')
        infoItemRepository = testModule.get('UserPMModule.InfoItemRepository')
        userInfoRepository = testModule.get('UserPMModule.UserInfoRepository')
        infoGroupRepository = testModule.get('UserPMModule.InfoGroupRepository')
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
            await connection.query('delete from infogroup_infoitem')
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from info_item')
            await connection.query('alter table info_item auto_increment = 1')
            await connection.query('delete from info_group')
            await connection.query('alter table info_group auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            await connection.query('delete from infogroup_infoitem')
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from info_item')
            await connection.query('alter table info_item auto_increment = 1')
            await connection.query('delete from info_group')
            await connection.query('alter table info_group auto_increment = 1')
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
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'birthday', label: '生日', description: '用户的生日', type: 'date', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            await userRepository.save({
                userName: '张三',
                password: '123456',
                salt: 'aaaaa',
                status: true,
                recycle: false,
                userInfos: [
                    { value: '三儿', infoItemId: 1 },
                    { value: '22', infoItemId: 2 },
                    { value: '1992-02-22', infoItemId: 3 }
                ]
            })
            let userInfos = await userService.userInfos(1)
            expect(userInfos).toBeDefined()
            expect(userInfos.length).toBe(3)
            expect(userInfos[0]).toEqual({ name: 'nickname', value: '三儿' })
            expect(userInfos[1]).toEqual({ name: 'age', value: '22' })
            expect(userInfos[2]).toEqual({ name: 'birthday', value: '1992-02-22' })
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

        it('should throw HttpException:指定userName=张三用户已存在, 406', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            try {
                await userService.createUser(null, '张三', '123456')
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(406)
                expect(err.getResponse()).toBe('指定userName=张三用户已存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 创建用户失败, 401', async () => {
            jest.spyOn(userRepository, 'save').mockImplementationOnce(async () => { throw new Error('创建用户失败') })
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

    describe('createUserWithUserInfo', async () => {

        beforeEach(async () => {
            (storeComponent as any).cache = {}
            await connection.query('delete from user_infoitem')
            await connection.query('delete from infogroup_infoitem')
            await connection.query('delete from info_item')
            await connection.query('alter table info_item auto_increment = 1')
            await connection.query('delete from info_group')
            await connection.query('alter table info_group auto_increment = 1')
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            (storeComponent as any).cache = {}
            await connection.query('delete from user_infoitem')
            await connection.query('delete from infogroup_infoitem')
            await connection.query('delete from info_item')
            await connection.query('alter table info_item auto_increment = 1')
            await connection.query('delete from info_group')
            await connection.query('alter table info_group auto_increment = 1')
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should success', async () => {
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            let group2 = await infoGroupRepository.save({
                name: '认证信息',
                default: true,
                status: true,
                items: [
                    { name: 'cardNumber', label: '身份证号', description: '用户的身份证号', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'email', label: '邮箱', description: '用户的邮箱', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'phone', label: '电话', description: '用户的电话', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                    { name: 'pic', label: '身份证照片', description: '用户的身份证正反面照片', type: 'uploadfile', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 4 }
                ]
            })
            await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                groupId: 1,
                infos: [
                    { name: 'nickname', value: '三儿' },
                    { name: 'age', value: '23' },
                    { name: 'hobby', array: ['电影', '吃饭', '打游戏'] }
                ]
            },
            {
                groupId: 2,
                infos: [
                    { name: 'cardNumber', value: '619199201112222044x' },
                    { name: 'email', value: '12345678@qq.com' },
                    { name: 'phone', value: '17299990000' },
                    { name: 'pic', rawName: 'test.jpeg', base64: 'XXADAB9WUDHQAUWDAWUDBWIUDBWUI', bucketName: 'public' }
                ]
            }])
            let user = await userRepository.findOneById(1, { relations: ['userInfos'] })
            expect(user).toBeDefined()
            expect(user.id).toBe(1)
            expect(user.userName).toBe('张三')
            expect(user.status).toBe(1)
            expect(user.recycle).toBe(0)
            expect(user.password).toBe(crypto.createHash('md5').update('123456' + user.salt).digest('hex'))
            expect(user.userInfos[0]).toEqual({ id: 1, value: '三儿', userId: 1, infoItemId: 1 })
            expect(user.userInfos[1]).toEqual({ id: 2, value: '23', userId: 1, infoItemId: 2 })
            expect(user.userInfos[2]).toEqual({ id: 3, value: '电影,吃饭,打游戏', userId: 1, infoItemId: 3 })
            expect(user.userInfos[3]).toEqual({ id: 4, value: '619199201112222044x', userId: 1, infoItemId: 4 })
            expect(user.userInfos[4]).toEqual({ id: 5, value: '12345678@qq.com', userId: 1, infoItemId: 5 })
            expect(user.userInfos[5]).toEqual({ id: 6, value: '17299990000', userId: 1, infoItemId: 6 })
            expect(user.userInfos[6]).toEqual({ id: 7, value: 'http://localhost:8080/public/test.jpeg', userId: 1, infoItemId: 7 })

        })

        it('should throw HttpException:指定id=1组织不存在, 402', async () => {
            try {
                await userService.createUserWithUserInfo(null, 1, '张三', '123456', [])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(402)
                expect(err.getResponse()).toBe('指定id=1组织不存在')
            }
        })

        it('should throw HttpException:指定userName=张三用户已存在, 406', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(406)
                expect(err.getResponse()).toBe('指定userName=张三用户已存在')
            }
        })

        it('should throw HttpException:出现了数据库错误Error: 保存用户失败，401', async () => {
            jest.spyOn(userRepository, 'save').mockImplementationOnce(() => { throw new Error('保存用户失败') })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存用户失败')
            }
        })

        it('should throw HttpException:指定信息组id=1不存在, 408', async () => {
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{ groupId: 1, infos: [] }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('指定信息组id=1不存在')
            }
        })

        it('should throw HttpException:指定名称信息项:email不存在于信息组id=1中, 409', async () => {
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'nickname', value: '三儿' },
                        { name: 'age', value: '23' },
                        { name: 'hobby', array: ['电影', '吃饭', '打游戏'] },
                        { name: 'email', value: 'aaaaaaaa' }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(409)
                expect(err.getResponse()).toBe('指定名称信息项:email不存在于信息组id=1中')
            }
        })

        it('should throw HttpException:指定名称信息值:nickname不存在, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'nickname', value: '' },
                        { name: 'age', value: '23' },
                        { name: 'hobby', array: ['电影', '吃饭', '打游戏'] }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息值:nickname不存在')
            }
        })

        it('should throw HttpException:指定名称信息项name=nickname必须为字符串, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'nickname', value: {} as any },
                        { name: 'age', value: '23' },
                        { name: 'hobby', array: ['电影', '吃饭', '打游戏'] }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息项name=nickname必须为字符串')
            }
        })

        it('should throw HttpException:指定名称信息项name=hobby必须为数组, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'nickname', value: 'ddddd' },
                        { name: 'age', value: '23' },
                        { name: 'hobby', array: 'aaaaa' as any }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息项name=hobby必须为数组')
            }
        })

        it('should throw HttpException:指定名称信息项name=pic必须具有文件base64编码, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '认证信息',
                default: true,
                status: true,
                items: [
                    { name: 'cardNumber', label: '身份证号', description: '用户的身份证号', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'email', label: '邮箱', description: '用户的邮箱', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'phone', label: '电话', description: '用户的电话', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                    { name: 'pic', label: '身份证照片', description: '用户的身份证正反面照片', type: 'uploadfile', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 4 }
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'cardNumber', value: '619199201112222044x' },
                        { name: 'email', value: '12345678@qq.com' },
                        { name: 'phone', value: '17299990000' },
                        { name: 'pic', rawName: 'test.jpeg', base64: '', bucketName: 'public' }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息项name=pic必须具有文件base64编码')
            }
        })

        it('should throw HttpException:指定名称信息项name=pic必须具有文件原名, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '认证信息',
                default: true,
                status: true,
                items: [
                    { name: 'cardNumber', label: '身份证号', description: '用户的身份证号', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'email', label: '邮箱', description: '用户的邮箱', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'phone', label: '电话', description: '用户的电话', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                    { name: 'pic', label: '身份证照片', description: '用户的身份证正反面照片', type: 'uploadfile', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 4 }
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'cardNumber', value: '619199201112222044x' },
                        { name: 'email', value: '12345678@qq.com' },
                        { name: 'phone', value: '17299990000' },
                        { name: 'pic', rawName: '', base64: 'XXXADASDASDADADW', bucketName: 'public' }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息项name=pic必须具有文件原名')
            }
        })

        it('should throw HttpException:指定名称信息项name=pic必须具有文件存储空间名, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '认证信息',
                default: true,
                status: true,
                items: [
                    { name: 'cardNumber', label: '身份证号', description: '用户的身份证号', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'email', label: '邮箱', description: '用户的邮箱', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'phone', label: '电话', description: '用户的电话', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                    { name: 'pic', label: '身份证照片', description: '用户的身份证正反面照片', type: 'uploadfile', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 4 }
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: [
                        { name: 'cardNumber', value: '619199201112222044x' },
                        { name: 'email', value: '12345678@qq.com' },
                        { name: 'phone', value: '17299990000' },
                        { name: 'pic', rawName: 'test.jpeg', base64: 'CASDAWRDAEFASEFSF', bucketName: '' }
                    ]
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息项name=pic必须具有文件存储空间名')
            }
        })

        it('should throw HttpException:指定信息项:nickname,age,hobby为必填项, 410', async () => {
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            try {
                await userService.createUserWithUserInfo(null, null, '张三', '123456', [{
                    groupId: 1,
                    infos: []
                }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定信息项:nickname,age,hobby为必填项')
            }
        })
    })

    describe('addUserInfoToUser', async () => {

        beforeEach(async () => {
            (storeComponent as any).cache = {}
            await connection.query('delete from user_infoitem')
            await connection.query('delete from infogroup_infoitem')
            await connection.query('delete from info_item')
            await connection.query('alter table info_item auto_increment = 1')
            await connection.query('delete from info_group')
            await connection.query('alter table info_group auto_increment = 1')
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        afterAll(async () => {
            (storeComponent as any).cache = {}
            await connection.query('delete from user_infoitem')
            await connection.query('delete from infogroup_infoitem')
            await connection.query('delete from info_item')
            await connection.query('alter table info_item auto_increment = 1')
            await connection.query('delete from info_group')
            await connection.query('alter table info_group auto_increment = 1')
            await connection.query('delete from user_info')
            await connection.query('alter table user_info auto_increment = 1')
            await connection.query('delete from user')
            await connection.query('alter table user auto_increment = 1')
        })

        it('should success and exist UserInfo will be update', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            let group1 = await infoGroupRepository.save({
                name: '基本信息',
                default: true,
                status: true,
                items: [
                    { name: 'nickname', label: '昵称', description: '用户的昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'age', label: '年龄', description: '用户的年龄', type: 'number', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'hobby', label: '爱好', description: '用户的爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                ]
            })
            let group2 = await infoGroupRepository.save({
                name: '认证信息',
                default: true,
                status: true,
                items: [
                    { name: 'cardNumber', label: '身份证号', description: '用户的身份证号', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 1 },
                    { name: 'email', label: '邮箱', description: '用户的邮箱', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 2 },
                    { name: 'phone', label: '电话', description: '用户的电话', type: 'text', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 3 },
                    { name: 'pic', label: '身份证照片', description: '用户的身份证正反面照片', type: 'uploadfile', necessary: true, registerVisible: true, informationVisible: true, default: true, order: 4 }
                ]
            })
            await userService.addUserInfoToUser(null, 1, [{
                groupId: 1,
                infos: [
                    { name: 'nickname', value: '三儿' },
                    { name: 'age', value: '23' },
                    { name: 'hobby', array: ['电影', '吃饭', '打游戏'] }
                ]
            },
            {
                groupId: 2,
                infos: [
                    { name: 'cardNumber', value: '619199201112222044x' },
                    { name: 'email', value: '12345678@qq.com' },
                    { name: 'phone', value: '17299990000' },
                    { name: 'pic', rawName: 'test.jpeg', base64: 'XXADAB9WUDHQAUWDAWUDBWIUDBWUI', bucketName: 'public' }
                ]
            }])
            let user = await userRepository.findOneById(1, { relations: ['userInfos'] })
            expect(user.userInfos[0]).toEqual({ id: 1, value: '三儿', userId: 1, infoItemId: 1 })
            expect(user.userInfos[1]).toEqual({ id: 2, value: '23', userId: 1, infoItemId: 2 })
            expect(user.userInfos[2]).toEqual({ id: 3, value: '电影,吃饭,打游戏', userId: 1, infoItemId: 3 })
            expect(user.userInfos[3]).toEqual({ id: 4, value: '619199201112222044x', userId: 1, infoItemId: 4 })
            expect(user.userInfos[4]).toEqual({ id: 5, value: '12345678@qq.com', userId: 1, infoItemId: 5 })
            expect(user.userInfos[5]).toEqual({ id: 6, value: '17299990000', userId: 1, infoItemId: 6 })
            expect(user.userInfos[6]).toEqual({ id: 7, value: 'http://localhost:8080/public/test.jpeg', userId: 1, infoItemId: 7 })
            await userService.addUserInfoToUser(null, 1, [{
                groupId: 1,
                infos: [
                    { name: 'nickname', value: '三儿子' },
                    { name: 'age', value: '28' },
                    { name: 'hobby', array: ['睡觉', '打盹', '荡秋千'] }
                ]
            },
            {
                groupId: 2,
                infos: [
                    { name: 'cardNumber', value: '619199201112222044x' },
                    { name: 'email', value: '12345678@qq.com' },
                    { name: 'phone', value: '17299990000' },
                    { name: 'pic', rawName: 'test.jpeg', base64: 'XXADAB9WUDHQAUWDAWUDBWIUDBWUI', bucketName: 'public' }
                ]
            }])
            user = await userRepository.findOneById(1, { relations: ['userInfos'] })
            expect(user.userInfos[0]).toEqual({ id: 1, value: '三儿子', userId: 1, infoItemId: 1 })
            expect(user.userInfos[1]).toEqual({ id: 2, value: '28', userId: 1, infoItemId: 2 })
            expect(user.userInfos[2]).toEqual({ id: 3, value: '睡觉,打盹,荡秋千', userId: 1, infoItemId: 3 })
            expect(user.userInfos[3]).toEqual({ id: 4, value: '619199201112222044x', userId: 1, infoItemId: 4 })
            expect(user.userInfos[4]).toEqual({ id: 5, value: '12345678@qq.com', userId: 1, infoItemId: 5 })
            expect(user.userInfos[5]).toEqual({ id: 6, value: '17299990000', userId: 1, infoItemId: 6 })
            expect(user.userInfos[6]).toEqual({ id: 7, value: 'http://localhost:8080/public/test.jpeg', userId: 1, infoItemId: 7 })
        })

        it('should throw HttpException:指定id=1用户不存在, 406', async () => {
            try {
                await userService.addUserInfoToUser(null, 1, [])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(406)
                expect(err.getResponse()).toBe('指定id=1用户不存在')
            }
        })

        it('should throw HttpException:指定信息组id=1不存在, 408', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            try {
                await userService.addUserInfoToUser(null, 1, [{ groupId: 1, infos: [] }])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(408)
                expect(err.getResponse()).toBe('指定信息组id=1不存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 保存用户失败，401', async () => {
            await userRepository.save({ userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false })
            jest.spyOn(userRepository, 'save').mockImplementationOnce(async () => { throw new Error('保存用户失败') })
            try {
                await userService.addUserInfoToUser(null, 1, [])
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存用户失败')
            }
        })
    })

    describe('addUserInfosAndInfoItems', async () => {

        beforeEach(async () => {
            (storeComponent as any).cache = {}
        })

        afterAll(async () => {
            (storeComponent as any).cache = {}
        })

        it('should success', async () => {
            let user = userRepository.create({ id: 1, userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, userInfos: [], infoItems: [] })
            let item1 = infoItemRepository.create({ id: 1, name: 'nickname', label: '昵称', default: true, description: '用户昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            let item2 = infoItemRepository.create({ id: 2, name: 'sex', label: '性别', default: true, description: '用户性别，只能为男或女', type: 'radio', necessary: true, registerVisible: true, informationVisible: true, order: 2 })
            let item3 = infoItemRepository.create({ id: 3, name: 'age', label: '年龄', default: true, description: '用户年龄，只能为数字', type: 'number', necessary: true, registerVisible: true, informationVisible: true, order: 3 })
            let group = infoGroupRepository.create({ id: 1, name: '基本信息', default: true, status: true, items: [item1, item2, item3] })
            let infos = [{ name: 'nickname', value: '三儿' }, { name: 'sex', value: '男' }, { name: 'age', value: '23' }]
            await userService.addUserInfosAndInfoItems(null, user, group, infos)
            expect(user.infoItems).toBeDefined()
            expect(user.infoItems.length).toBe(3)
            expect(user.infoItems).toEqual([item1, item2, item3])
            expect(user.userInfos).toBeDefined()
            expect(user.userInfos.length).toBe(3)
            expect(user.userInfos[0]).toEqual({ value: '三儿', infoItem: item1 })
            expect(user.userInfos[1]).toEqual({ value: '男', infoItem: item2 })
            expect(user.userInfos[2]).toEqual({ value: '23', infoItem: item3 })
        })

        it('should throw HttpException:指定名称信息项:age不存在于信息组id=1中, 409', async () => {
            let user = userRepository.create({ id: 1, userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, userInfos: [], infoItems: [] })
            let item1 = infoItemRepository.create({ id: 1, name: 'nickname', label: '昵称', default: true, description: '用户昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            let group = infoGroupRepository.create({ id: 1, name: '基本信息', default: true, status: true, items: [item1] })
            let infos = [{ name: 'nickname', value: '三儿' }, { name: 'sex', value: '男' }, { name: 'age', value: '23' }]
            try {
                await userService.addUserInfosAndInfoItems(null, user, group, infos)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(409)
                expect(err.getResponse()).toBe('指定名称信息项:sex不存在于信息组id=1中')
            }
        })

        it('should throw HttpException:指定信息项:sex,age为必填项, 410', async () => {
            let user = userRepository.create({ id: 1, userName: '张三', password: '123456', salt: 'aaaaa', status: true, recycle: false, userInfos: [], infoItems: [] })
            let item1 = infoItemRepository.create({ id: 1, name: 'nickname', label: '昵称', default: true, description: '用户昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            let item2 = infoItemRepository.create({ id: 2, name: 'sex', label: '性别', default: true, description: '用户性别，只能为男或女', type: 'radio', necessary: true, registerVisible: true, informationVisible: true, order: 2 })
            let item3 = infoItemRepository.create({ id: 3, name: 'age', label: '年龄', default: true, description: '用户年龄，只能为数字', type: 'number', necessary: true, registerVisible: true, informationVisible: true, order: 3 })
            let group = infoGroupRepository.create({ id: 1, name: '基本信息', default: true, status: true, items: [item1, item2, item3] })
            let infos = [{ name: 'nickname', value: '三儿' }]
            try {
                await userService.addUserInfosAndInfoItems(null, user, group, infos)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定信息项:sex,age为必填项')
            }
        })
    })

    describe('transfromInfoValue', async () => {

        beforeEach(async () => {
            (storeComponent as any).cache = {}
        })

        afterAll(async () => {
            (storeComponent as any).cache = {}
        })

        it('text success', async () => {
            let item = infoItemRepository.create({ id: 1, name: 'nickname', label: '昵称', default: true, description: '用户昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            let result = await userService.transfromInfoValue(null, item, { name: 'nickname', value: '三儿' })
            expect(result).toBe('三儿')
        })

        it('should throw HttpException:指定名称信息值:nickname不存在, 410', async () => {
            let item = infoItemRepository.create({ id: 1, name: 'nickname', label: '昵称', default: true, description: '用户昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            try {
                await userService.transfromInfoValue(null, item, { name: 'nickname', value:null })
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息值:nickname不存在')
            } 
        })

        it('should throw HttpException;指定名称信息项name=nickname必须为字符串, 410',async ()=>{
            let item = infoItemRepository.create({ id: 1, name: 'nickname', label: '昵称', default: true, description: '用户昵称', type: 'text', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            try {
                await userService.transfromInfoValue(null, item, { name: 'nickname', value:23 } as any)
                expect(1).toBe(2)
            } catch (err) {
                expect(err instanceof HttpException).toBeTruthy()
                expect(err.getStatus()).toBe(410)
                expect(err.getResponse()).toBe('指定名称信息项name=nickname必须为字符串')
            } 
        })

        it('array success',async ()=>{
            let item = infoItemRepository.create({ id: 1, name: 'hobby', label: '爱好', default: true, description: '用户爱好', type: 'checkbox', necessary: true, registerVisible: true, informationVisible: true, order: 1 })
            let result = await userService.transfromInfoValue(null, item, { name: 'hobby', array: ['吃饭','睡觉','打游戏']})
            expect(result).toBe('吃饭,睡觉,打游戏')
        })
    })
})
