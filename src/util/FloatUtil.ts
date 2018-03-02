import { Component, HttpException } from '@nestjs/common';

/* 异步操作文件的封装工具类 */
@Component()
export class FloatUtil {

    constructor() { }

    async add(a: number, b: number): Promise<number> {
        let str1:string,str2:string
        /* 计算小数点位置 */
        let index1 = (a + '').indexOf('.')
        let index2 = (b + '').indexOf('.')
        /* 计算小数点后位数 */
        let num1 = index1 < 0 ? 0 : (a + '').length - index1 - 1
        let num2 = index2 < 0 ? 0 : (b + '').length - index2 - 1
        /* 整数 */
        if (num1 === 0 && num2 === 0) {
            return a + b
        }
        let num = num1 - num2
        if (num>0) {
            str1 = (a + '').replace('.','')
            str2 = (b + '').replace('.','').concat(new Array(num).fill('0').join(''))
        }else{
            str1 = (a + '').replace('.','').concat(new Array(-num).fill('0').join(''))
            str2 = (b + '').replace('.','')
        }
        let temp = Number.parseInt(str1)+Number.parseInt(str2)
        let result:string = temp+''
        if(num>0){
            result = (temp+'').
        }
        return num>0?
    }


}