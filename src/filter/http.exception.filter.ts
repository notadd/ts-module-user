import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: HttpException, context: ArgumentsHost) {
        const status = exception.getStatus();
        const message = exception.getResponse();
        const response = context.switchToHttp().getResponse();
        response
            .status(status)
            .json({
                code: status,
                message
            });
    }
}
