import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class ExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, stream$: Observable<any>): Observable<any>;
}
