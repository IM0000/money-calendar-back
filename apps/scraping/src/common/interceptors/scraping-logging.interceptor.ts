import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ScrapingLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ScrapingLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();
    const requestId = `${method}-${url}-${now}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    this.logger.log(`[${requestId}] 스크래핑 요청 시작: ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const elapsedTime = Date.now() - now;
          this.logger.log(
            `[${requestId}] 스크래핑 요청 완료: ${method} ${url} - ${elapsedTime}ms`,
          );

          // 스크래핑 결과 요약 로깅 (결과 구조에 따라 조정 필요)
          if (data) {
            if (Array.isArray(data)) {
              this.logger.log(
                `[${requestId}] 수집된 데이터: ${data.length}개 항목`,
              );
            } else if (typeof data === 'object') {
              const keys = Object.keys(data);
              this.logger.log(
                `[${requestId}] 수집된 데이터: ${keys.join(', ')}`,
              );
            }
          }
        },
        error: (error) => {
          const elapsedTime = Date.now() - now;
          this.logger.error(
            `[${requestId}] 스크래핑 요청 실패: ${method} ${url} - ${elapsedTime}ms`,
            error.stack,
          );
        },
      }),
    );
  }
}
