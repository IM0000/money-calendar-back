import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ScrapingException } from '../exceptions/scraping.exceptions';

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
