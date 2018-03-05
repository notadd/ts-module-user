import { FloatUtil } from '../../src/util/FloatUtil';

describe('FloatUtil', () => {

    let floatUtil: FloatUtil

    beforeEach(() => {
        floatUtil = new FloatUtil()
    })

    describe('add', () => {
        it('result should be 3', async () => {
            expect(await floatUtil.add(1, 2)).toBe(3)
        })
        it('result should be 0.3', async () => {
            expect(await floatUtil.add(0.1, 0.2)).toBe(0.3)
        })
        it('result should be 0.8', async () => {
            expect(await floatUtil.add(0.7, 0.1)).toBe(0.8)
        })
        it('result should be 122.322', async () => {
            expect(await floatUtil.add(100, 22.322)).toBe(122.322)
        })
        it('result should be 0.24444', async () => {
            expect(await floatUtil.add(1.24444, -1)).toBe(0.24444)
        })
        it('result should be -11.22', async () => {
            expect(await floatUtil.add(-1.2, -10.02)).toBe(-11.22)
        })
        it('result should be 222.333333333333', async () => {
            expect(await floatUtil.add(111.111111111111, 111.222222222222)).toBe(222.333333333333)
        })
    })

})