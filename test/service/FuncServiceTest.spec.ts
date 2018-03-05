import { FuncService } from '../../src/service/FuncService';

describe('FuncService', async () => {

    describe('createFunc', async () => {

        it('should throw HttpException: 指定模块token=aaaa不存在,415', async () => {
            let moduleRepository = { findOneById: async (moduleToken: string): Promise<any> => Promise.resolve(null) }
            let funcService: FuncService = new FuncService({} as any, moduleRepository as any, {} as any)
            try {
                await funcService.createFunc('aaaa', '管理文章')
            } catch (err) {
                expect(err.getStatus()).toBe(415)
                expect(err.getResponse()).toBe('指定模块token=aaaa不存在')
            }
        })

        it('should throw HttpException: 指定模块token=aaaa下，指定名称name=bbbb功能已经存在, 416', async () => {
            let funcRepository = { findOne: async (func: any): Promise<any> => Promise.resolve({ id: 1, name: 'bbbb' }) }
            let moduleRepository = { findOneById: async (moduleToken: string): Promise<any> => Promise.resolve({ token: 'aaaa' }) }
            let funcService: FuncService = new FuncService(funcRepository as any, moduleRepository as any, {} as any)
            try {
                await funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(416)
                expect(err.getResponse()).toBe('指定模块token=aaaa下，指定名称name=bbbb功能已经存在')
            } 
        })

        it('should throw HttpException: 数据库错误Error: 保存功能失败, 401', async () => {
            let funcRepository = {
                create: (func: any): any => func,
                findOne: async (func: any): Promise<any> => Promise.resolve(null),
                save: async (func: any): Promise<void> => { throw new Error('保存功能失败') }
            }
            let moduleRepository = { findOneById: async (moduleToken: string): Promise<any> => Promise.resolve({ token: 'aaaa' }) }
            let funcService: FuncService = new FuncService(funcRepository as any, moduleRepository as any, {} as any)
            try {
                await funcService.createFunc('aaaa', 'bbbb')
            } catch (err) {
                expect(err.getStatus()).toBe(401)
                expect(err.getResponse()).toBe('数据库错误Error: 保存功能失败')
            } 
        })
    })
})