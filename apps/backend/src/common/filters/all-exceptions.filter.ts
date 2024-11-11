// common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = ErrorCodes.SERVER_001;
    let errorMessage = '내부 서버 오류';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'errorCode' in exceptionResponse &&
        'message' in exceptionResponse
      ) {
        errorCode = (exceptionResponse as any).errorCode;
        errorMessage = (exceptionResponse as any).message;
      } else if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      }
    }

    response.status(status).json({
      statusCode: status,
      errorCode,
      errorMessage,
      data: null, // 에러 응답에서는 data는 null로 설정
    });
  }
}
