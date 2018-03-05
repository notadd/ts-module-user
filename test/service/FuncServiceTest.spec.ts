import { TestRepositorysProvider } from '../database/TestRepositorysProvider';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { TestConnectionProvider } from '../database/TestConnectionProvider';
import { TestingModule } from '@nestjs/testing/testing-module';
import { FuncService } from '../../src/service/FuncService';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('FuncService', async () => {
    
    let moduleBuilder: TestingModuleBuilder

    describe('createFunc', async () => {
        beforeEach(async () => {
            moduleBuilder = await Test.createTestingModule({
                components: [TestConnectionProvider, ...TestRepositorysProvider, FuncService]
            })
        })
        it('should throw HttpException: module no exist', async () => {
            let moduleRepository = { findOneById: async (moduleToken: string) => null }
            let module: TestingModule = await moduleBuilder.overrideComponent('UserPMModule.ModuleRepository').useValue(moduleRepository).compile()
            let funcService: FuncService = module.get<FuncService>(FuncService)
            try{
                funcService.createFunc('aaaa','管理文章')
            }catch(err){
                expect(err.getStatus()).toBe(415)
                expect(err.getResponse()).toBe('指定模块token=aaaa不存在')
            }
        })
    })


})