// common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';
import { frontendConfig } from '../../config/frontend.config';
import { ConfigType } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    @Inject(frontendConfig.KEY)
    private frontendConfiguration: ConfigType<typeof frontendConfig>,
  ) {}

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
    let stackMessage = null;

    // 프론트엔드 URL 설정
    const frontendURL =
      this.frontendConfiguration.baseUrl || 'http://localhost:5173';

    if (exception instanceof Error) {
      stackMessage = exception.message;
    }
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
      stackMessage,
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
      // OAuth 콜백 관련 요청 처리 (특히 계정 연결 관련)
      if (
        url.includes('/oauth') &&
        url.includes('/callback') &&
        request.query.state
      ) {
        // OAuth 연결 과정에서 오류가 발생한 경우 마이페이지로 리디렉션
        this.logger.log('OAuth 콜백 처리 중 오류 발생, 마이페이지로 리디렉션');
        return response.redirect(
          `${frontendURL}/mypage?errorCode=${errorCode}&errorMessage=${encodeURIComponent(
            errorMessage,
          )}`,
        );
      }
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

      // 에러 메시지가 Error 객체에서 온 경우 설정
      if (exception instanceof Error) {
        errorMessage = exception.message;
      }
    }

    // API 요청 등의 경우 JSON 응답
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
