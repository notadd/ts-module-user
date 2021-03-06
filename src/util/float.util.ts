import { Injectable } from "@nestjs/common";

/* 异步操作文件的封装工具类 */
@Injectable()
export class FloatUtil {
    /*两个浮点数相加，返回浮点数 */
    async add(a: number, b: number): Promise<number> {
        /*声明转换后的整数字符串 */
        let str1: string, str2: string;
        /* 计算小数点位置 */
        const index1 = (a + "").indexOf(".");
        const index2 = (b + "").indexOf(".");
        /* 计算小数点后位数 */
        const num1 = index1 < 0 ? 0 : (a + "").length - index1 - 1;
        const num2 = index2 < 0 ? 0 : (b + "").length - index2 - 1;
        /* 整数 */
        if (num1 === 0 && num2 === 0) {
            return a + b;
        }
        const num = num1 - num2;
        /*如果第一个浮点数小数点后位数大于第二个 */
        if (num > 0) {
            /*第一个浮点数直接去掉小数点 */
            str1 = (a + "").replace(".", "");
            /*第二个去掉小数点后，在后面补0 */
            str2 = (b + "").replace(".", "").concat(new Array(num).fill("0").join(""));
        }
        /*如果第二个浮点数小数点后位数大于第一个 */
        else {
            /*第一个去掉小数点，后面补0 */
            str1 = (a + "").replace(".", "").concat(new Array(-num).fill("0").join(""));
            /*第二个直接去掉小数点 */
            str2 = (b + "").replace(".", "");
        }
        /*计算整数相加结果，如果有负号在这一步也一样处理 */
        const temp = Number.parseInt(str1) + Number.parseInt(str2);
        /*整数结果字符串 */
        const result: string = temp + "";
        /*小数点应该插入的下标 */
        let decimalPointIndex = 0;
        /*如果第一个小数位数大于第二个 */
        if (num > 0) {
            decimalPointIndex = result.length - num1;
        } else {
            decimalPointIndex = result.length - num2;
        }

        return Number.parseFloat(result.substr(0, decimalPointIndex).concat(".", result.substr(decimalPointIndex)));
    }

}
