import { get, post, CoreOptions, Response } from "request";
import { Injectable, HttpException } from "@nestjs/common";

@Injectable()
export class HttpUtil {

    async get(uri: string, options: CoreOptions): Promise<any> {
        const result: any = await new Promise((ok, no) => {
            get(uri, options, (err: any, res: Response, body: any) => {
                if (err) {
                    no(err);
                } else {
                    const result = JSON.parse(body);
                    if (result.error) {
                        no(new HttpException(err.toString(), 404));
                        return;
                    }
                    ok(result);
                }
                return;
            });
        });
        return result;
    }

    async post(uri: string, options: CoreOptions): Promise<any> {
        const result: any = await new Promise((ok, no) => {
            post(uri, options, (err: any, res: Response, body: any) => {
                if (err) {
                    no(err);
                } else {
                    const result = JSON.parse(body);
                    if (result.error) {
                        no(new HttpException(err.toString(), 404));
                        return;
                    }
                    ok(result);
                }
                return;
            });
        });
        return result;
    }
}
