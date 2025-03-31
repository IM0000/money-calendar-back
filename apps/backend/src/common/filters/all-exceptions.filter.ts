// common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
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
    const { method, url, body, params, query } = request;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = ErrorCodes.SERVER_001;
    let errorMessage = '내부 서버 오류';
    let data = null;
    let stack = null;

    // 개발 환경에서만 스택 트레이스 포함
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      stack = exception.stack;
    }

    // 에러 정보 로깅
    const errorContext = {
      timestamp: new Date().toISOString(),
      path: url,
      method,
      requestBody: this.sanitizeData(body),
      requestParams: params,
      requestQuery: query,
      errorStack: stack,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

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

      this.logger.error(
        `[${errorCode}] ${errorMessage} (${status})`,
        errorContext,
      );
    } else {
      this.logger.error(
        `Unexpected error: ${
          exception instanceof Error ? exception.message : 'Unknown error'
        }`,
        {
          ...errorContext,
          exception:
            exception instanceof Error ? exception.message : String(exception),
        },
      );
    }

    // 클라이언트에게 반환할 응답 객체
    const responseBody = {
      statusCode: status,
      errorCode,
      errorMessage,
      data,
      timestamp: new Date().toISOString(),
      path: url,
    };

    // 개발 환경에서만 스택 트레이스 포함
    if (process.env.NODE_ENV !== 'production' && stack) {
      responseBody['stack'] = stack;
    }

    response.status(status).json(responseBody);
  }

  // 민감한 정보 제거
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };

    // 비밀번호 필드 마스킹
    if (sanitized.password) sanitized.password = '******';
    if (sanitized.currentPassword) sanitized.currentPassword = '******';
    if (sanitized.newPassword) sanitized.newPassword = '******';

    // 토큰 필드 마스킹
    if (sanitized.accessToken) sanitized.accessToken = '******';
    if (sanitized.refreshToken) sanitized.refreshToken = '******';

    return sanitized;
  }
}
