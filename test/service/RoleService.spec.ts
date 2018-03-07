import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { TestingModule } from '@nestjs/testing/testing-module';
import { RoleService } from '../../src/service/RoleService';
import { Repository, Connection } from 'typeorm';
import { Module } from '../../src/model/Module';
import { Role } from '../../src/model/Role';
import { Func } from '../../src/model/Func';
import { Test } from '@nestjs/testing';


describe('RoleService', async () => {

    let testModule: TestingModule
    let roleService: RoleService
    let connection: Connection
    let funcRepository: Repository<Func>
    let roleRepository: Repository<Role>
    let moduleRepository: Repository<Module>
    let tables = ['role', 'function','module']

    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            components: [TestConnectionProvider, ...TestRepositorysProvider, RoleService]
        }).compile()
        roleService = testModule.get<RoleService>(RoleService)
        connection = testModule.get('UserPMModule.Connection')
        funcRepository = testModule.get('UserPMModule.FuncRepository')
        roleRepository = testModule.get('UserPMModule.RoleRepository')
        moduleRepository = testModule.get('UserPMModule.ModuleRepository')
    }, 10000)

    /* 在每个it运行之前都会运行，而不是在这一级包含的每个describe运行之前 */
    beforeEach(async () => {
        await connection.query('delete from role_func')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
    })

    afterAll(async () => {
        await connection.query('delete from role_func')
        for (let i = 0; i < tables.length; i++) {
            await connection.query('delete from ' + tables[i])
            await connection.query('alter table ' + tables[i] + ' auto_increment = 1')
        }
        if (connection && connection.isConnected) {
            await connection.close()
        }
    })

    describe('createRole', async () => {

        it('should success', async () => {
            await moduleRepository.save({token:'aaaaa'})
            await roleService.createRole('aaaaa','管理员',80)
            let role = await roleRepository.findOneById(1)
            expect(role).toEqual({id:1,name:'管理员',score:80,moduleToken:'aaaaa'})
        })

        it('should throw HttpException:指定模块token=aaaaa不存在, 415',async ()=>{
            try{
                await roleService.createRole('aaaaa','管理员',80)                
            }catch(err){
                expect(err.getStatus()).toBe(415)
                expect(err.getResponse()).toBe('指定模块token=aaaaa不存在')
            }
        })

        it('should throw HttpException:指定模块token=aaaaa下，指定名称name=管理员角色已经存在, 420',async ()=>{
            await moduleRepository.save({token:'aaaaa',roles:[{name:'管理员',score:80}]})            
            try{
                await roleService.createRole('aaaaa','管理员',80)                
            }catch(err){
                expect(err.getStatus()).toBe(420)
                expect(err.getResponse()).toBe('指定模块token=aaaaa下，指定名称name=管理员角色已经存在')
            }
        })

        it('should throw HttpException:数据库错误Error: 创建角色失败，401',async ()=>{
            await moduleRepository.save({token:'aaaaa'})
            jest.spyOn(roleRepository,'save').mockImplementationOnce(async ()=>{throw new Error('创建角色失败')})
            try{
                await roleService.createRole('aaaaa','管理员',80)                
            }catch(err){
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 创建角色失败')
            }
        
        })
    })

})