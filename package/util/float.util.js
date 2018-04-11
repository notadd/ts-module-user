"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
/* 异步操作文件的封装工具类 */
var FloatUtil = /** @class */ (function () {
    function FloatUtil() {
    }
    /*两个浮点数相加，返回浮点数 */
    FloatUtil.prototype.add = function (a, b) {
        return __awaiter(this, void 0, void 0, function () {
            var str1, str2, index1, index2, num1, num2, num, temp, result, decimal_point_index;
            return __generator(this, function (_a) {
                index1 = (a + "").indexOf(".");
                index2 = (b + "").indexOf(".");
                num1 = index1 < 0 ? 0 : (a + "").length - index1 - 1;
                num2 = index2 < 0 ? 0 : (b + "").length - index2 - 1;
                /* 整数 */
                if (num1 === 0 && num2 === 0) {
                    return [2 /*return*/, a + b];
                }
                num = num1 - num2;
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
                temp = Number.parseInt(str1) + Number.parseInt(str2);
                result = temp + "";
                decimal_point_index = null;
                /*如果第一个小数位数大于第二个 */
                if (num > 0) {
                    decimal_point_index = result.length - num1;
                }
                else {
                    decimal_point_index = result.length - num2;
                }
                return [2 /*return*/, Number.parseFloat(result.substr(0, decimal_point_index).concat(".", result.substr(decimal_point_index)))];
            });
        });
    };
    FloatUtil = __decorate([
        common_1.Component()
    ], FloatUtil);
    return FloatUtil;
}());
exports.FloatUtil = FloatUtil;
