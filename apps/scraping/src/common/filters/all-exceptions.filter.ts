import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ScrapingException } from '../exceptions/scraping.exceptions';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponse {
  @ApiProperty({
    description: '발생 시간',
    example: '2023-06-01T12:34:56.789Z',
  })
  timestamp: string;

  @ApiProperty({ description: '요청 경로', example: '/scraping/company' })
  path: string;

  @ApiProperty({ description: 'HTTP 상태 코드', example: 500 })
  statusCode: number;

  @ApiProperty({ description: '에러 코드', example: 'SCRAPING_ERROR' })
  errorCode?: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '스크래핑 중 오류가 발생했습니다',
  })
  message: string;

  @ApiProperty({ description: '에러 상세 정보', required: false })
  details?: any;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 도메인 예외 처리 (ScrapingException)
    if (exception instanceof ScrapingException) {
      const { statusCode, message, errorCode, details } = exception;
      response.status(statusCode).json({
        timestamp: new Date().toISOString(),
        path: request.url,
        statusCode,
        errorCode,
        message,
        details,
      });
      return;
    }

    // NestJS HttpException 처리
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      response.status(status).json(errorResponse);
      return;
    }

    // 그 외 예외 처리 (Internal Server Error)
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
    });
  }
}
