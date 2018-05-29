/// <reference types="request" />
import { CoreOptions } from "request";
export declare class HttpUtil {
    wechatOauthGet(uri: string, options: CoreOptions): Promise<any>;
    post(uri: string, options: CoreOptions): Promise<any>;
}
