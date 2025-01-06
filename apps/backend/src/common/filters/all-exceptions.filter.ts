// common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = ErrorCodes.SERVER_001;
    let errorMessage = '내부 서버 오류';
    let data = null;
    this.logger.debug(JSON.stringify(exception, null, 2));

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      this.logger.debug(JSON.stringify(exceptionResponse, null, 2));
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'errorCode' in exceptionResponse &&
        'errorMessage' in exceptionResponse
      ) {
        errorCode = (exceptionResponse as any).errorCode;
        errorMessage = (exceptionResponse as any).errorMessage;
        data = (exceptionResponse as any).data || null;
      } else if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      }
    } else {
      this.logger.error('Unexpected error', exception as any);
    }

    response.status(status).json({
      statusCode: status,
      errorCode,
      errorMessage,
      data, // 에러 응답에서는 data는 null로 설정
    });
  }
}
