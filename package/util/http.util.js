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
const request_1 = require("request");
const common_1 = require("@nestjs/common");
let HttpUtil = class HttpUtil {
    wechatOauthGet(uri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new Promise((ok, no) => {
                request_1.get(uri, options, (err, res, body) => {
                    if (err) {
                        no(err);
                    }
                    else {
                        const result = JSON.parse(body);
                        if (result.errcode) {
                            no(new common_1.HttpException(`${result.errcode}:${result.errmsg}`, 404));
                            return;
                        }
                        ok(result);
                    }
                    return;
                });
            });
            return result;
        });
    }
    post(uri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new Promise((ok, no) => {
                request_1.post(uri, options, (err, res, body) => {
                    if (err) {
                        no(err);
                    }
                    else {
                        const result = JSON.parse(body);
                        if (result.error) {
                            no(new common_1.HttpException(err.toString(), 404));
                            return;
                        }
                        ok(result);
                    }
                    return;
                });
            });
            return result;
        });
    }
};
HttpUtil = __decorate([
    common_1.Injectable()
], HttpUtil);
exports.HttpUtil = HttpUtil;

//# sourceMappingURL=http.util.js.map
