import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { StoreComponent } from '../../src/interface/StoreComponent';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserService } from '../../src/service/UserService';
import { Permission } from '../../src/model/Permission';
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
    let permissionRepository: Repository<Permission>
    let tables = ['permission', 'function', 'role', 'user', 'module']
    let joinTables = ['user_role', 'role_func', 'function_permission', 'user_adds_permission', 'user_reduces_permission']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, UserService]
        }).overrideComponent('StoreComponentToken').useValue({}).compile()
        connection = testModule.get('UserPMModule.Connection')
        userService = testModule.get<UserService>(UserService)
        userRepository = testModule.get('UserPMModule.UserRepository')
        roleRepository = testModule.get('UserPMModule.RoleRepository')
        funcRepository = testModule.get('UserPMModule.FuncRepository')
        moduleRepository = testModule.get('UserPMModule.ModuleRepository')
        permissionRepository = testModule.get('UserPMModule.PermissionRepository')
    }, 10000)

    /* 在每个it运行之前都会运行，而不是在这一级包含的每个describe运行之前 */
    beforeEach(async () => {
        for (let i = 0; i < joinTables.length; i++) {
            await connection.query('delete from ' + joinTables[i])
        }
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
    })

    afterAll(async () => {
        for (let i = 0; i < joinTables.length; i++) {
            await connection.query('delete from ' + joinTables[i])
        }
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

        it('the user with recycle is true not return',async ()=>{
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

})
