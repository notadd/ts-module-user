import { FloatUtil } from '../../src/util/FloatUtil';

describe('FloatUtil', () => {

    let floatUtil: FloatUtil

    beforeEach(() => {
        floatUtil = new FloatUtil()
    })

    describe('add', () => {
        it('result should be 0.3', async () => {
            expect(await floatUtil.add(0.1, 0.2)).toBe(0.3)
        })
        it('result should be 0.8', async () => {
            expect(await floatUtil.add(0.7, 0.1)).toBe(0.8)
        })
    })
})