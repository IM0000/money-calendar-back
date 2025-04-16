import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import {
  ScrapingException,
  NetworkException,
  ElementNotFoundException,
  TimeoutException,
  ParsingException,
  WebsiteStructureChangedException,
  AccessBlockedException,
} from '../exceptions/scraping.exceptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 내부 오류가 발생했습니다';
    let error = 'Internal Server Error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details = null;

    this.logger.error(
      `Exception occurred: ${this.getExceptionMessage(exception)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 스크래핑 관련 커스텀 예외 처리
    if (exception instanceof ScrapingException) {
      const exceptionResponse = exception.getResponse() as any;
      status = exception.getStatus();
      message = exceptionResponse.message;
      error = exceptionResponse.error;
      errorCode = exceptionResponse.errorCode;
      details = exceptionResponse.details;
    }
    // HTTP 예외 처리
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      } else {
        message = exceptionResponse as string;
      }
    }
    // Axios 네트워크 오류 처리
    else if (axios.isAxiosError(exception)) {
      status = exception.response?.status || HttpStatus.SERVICE_UNAVAILABLE;
      message = '외부 API 요청 중 오류가 발생했습니다';
      error = 'External API Error';
      errorCode = 'EXTERNAL_API_ERROR';
      details = {
        url: exception.config?.url,
        method: exception.config?.method,
        code: exception.code,
        responseStatus: exception.response?.status,
        responseData: exception.response?.data,
      };
    }
    // Puppeteer 관련 오류 처리
    else if (
      exception instanceof Error &&
      exception.name === 'TimeoutError' &&
      /puppeteer|playwright/i.test(exception.stack || '')
    ) {
      status = HttpStatus.GATEWAY_TIMEOUT;
      message = '페이지 로딩 시간이 초과되었습니다';
      error = 'Page Load Timeout';
      errorCode = 'PAGE_LOAD_TIMEOUT';
    }
    // 일반 오류 처리
    else if (exception instanceof Error) {
      // 타임아웃 관련 오류
      if (
        exception.message.includes('timeout') ||
        exception.message.includes('ETIMEDOUT')
      ) {
        status = HttpStatus.GATEWAY_TIMEOUT;
        message = '요청 시간이 초과되었습니다';
        error = 'Request Timeout';
        errorCode = 'REQUEST_TIMEOUT';
      }
      // 파싱 관련 오류
      else if (
        exception.message.includes('parse') ||
        exception.message.includes('JSON') ||
        exception.message.includes('Unexpected token')
      ) {
        status = HttpStatus.BAD_REQUEST;
        message = '데이터 파싱 중 오류가 발생했습니다';
        error = 'Parse Error';
        errorCode = 'PARSE_ERROR';
      }
      // 스크래핑 관련 오류
      else if (
        exception.message.includes('selector') ||
        exception.message.includes('element') ||
        exception.message.includes('XPath')
      ) {
        status = HttpStatus.BAD_REQUEST;
        message = '웹페이지 구조가 변경되어 데이터를 찾을 수 없습니다';
        error = 'Scraping Error';
        errorCode = 'SCRAPING_ERROR';
      }
      // 네트워크 관련 오류
      else if (
        exception.message.includes('ENOTFOUND') ||
        exception.message.includes('ECONNREFUSED') ||
        exception.message.includes('network')
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = '네트워크 연결에 실패했습니다';
        error = 'Network Error';
        errorCode = 'NETWORK_ERROR';
      }
      // 기타 오류는 일반 서버 오류로 처리
      else {
        message = exception.message;
      }

      details = {
        name: exception.name,
        stack:
          process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      };
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorCode,
      error,
      message,
      details,
    });
  }

  private getExceptionMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    }
    if (exception instanceof Error) {
      return exception.message;
    }
    return String(exception);
  }
}
