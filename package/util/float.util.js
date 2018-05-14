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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let FloatUtil = class FloatUtil {
    add(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            let str1, str2;
            const index1 = (a + "").indexOf(".");
            const index2 = (b + "").indexOf(".");
            const num1 = index1 < 0 ? 0 : (a + "").length - index1 - 1;
            const num2 = index2 < 0 ? 0 : (b + "").length - index2 - 1;
            if (num1 === 0 && num2 === 0) {
                return a + b;
            }
            const num = num1 - num2;
            if (num > 0) {
                str1 = (a + "").replace(".", "");
                str2 = (b + "").replace(".", "").concat(new Array(num).fill("0").join(""));
            }
            else {
                str1 = (a + "").replace(".", "").concat(new Array(-num).fill("0").join(""));
                str2 = (b + "").replace(".", "");
            }
            const temp = Number.parseInt(str1) + Number.parseInt(str2);
            const result = temp + "";
            let decimalPointIndex = 0;
            if (num > 0) {
                decimalPointIndex = result.length - num1;
            }
            else {
                decimalPointIndex = result.length - num2;
            }
            return Number.parseFloat(result.substr(0, decimalPointIndex).concat(".", result.substr(decimalPointIndex)));
        });
    }
};
FloatUtil = __decorate([
    common_1.Injectable()
], FloatUtil);
exports.FloatUtil = FloatUtil;

//# sourceMappingURL=float.util.js.map
