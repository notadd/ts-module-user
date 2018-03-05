import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { TestingModule } from '@nestjs/testing/testing-module';
import { FuncService } from '../../src/service/FuncService';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
describe('FuncService', async () => {

    let moduleBuilder: TestingModuleBuilder
    let module: TestingModule
    describe('createFunc', async () => {
        beforeEach(async () => {
            moduleBuilder = await Test.createTestingModule({
                components: [FuncService]
            })
        })
        it('should throw HttpException: 指定模块token=aaaa不存在,415', async () => {
            let moduleRepository = { findOneById: async (moduleToken: string) => null }
            module = await moduleBuilder
                .overrideComponent('UserPMModule.FuncRepository').useValue({})
                .overrideComponent('UserPMModule.ModuleRepository').useValue(moduleRepository)
                .overrideComponent('UserPMModule.PermissionRepository').useValue({})
                .compile()
            let funcService: FuncService = module.get<FuncService>(FuncService)
            try {
                funcService.createFunc('aaaa', '管理文章')
            } catch (err) {
                expect(err.getStatus()).toBe(415)
                expect(err.getResponse()).toBe('指定模块token=aaaa不存在')
            }
        })
        it('should throw HttpException: 指定模块token=aaaa下，指定名称name=bbbb功能已经存在, 416', async () => {
            let funcRepository = { findOne: async (func: any): Promise<any> => Promise.resolve({ id: 1, name: 'bbbb' }) }
            module = await moduleBuilder
                .overrideComponent('UserPMModule.FuncRepository').useValue(funcRepository)
                .overrideComponent('UserPMModule.ModuleRepository').useValue({})
                .overrideComponent('UserPMModule.PermissionRepository').useValue({})
                .compile()
            let funcService: FuncService = module.get<FuncService>(FuncService)
            try {
                funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(416)
                expect(err.getResponse()).toBe('指定模块token=aaaa下，指定名称name=bbbb功能已经存在')
            }
        })
    })


})