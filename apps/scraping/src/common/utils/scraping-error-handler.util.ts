import { Logger } from '@nestjs/common';
import axios from 'axios';
import {
  ScrapingException,
  NetworkException,
  ElementNotFoundException,
  TimeoutException,
  ParsingException,
  AccessBlockedException,
} from '../exceptions/scraping.exceptions';

/**
 * 스크래핑 오류 처리 유틸리티 클래스
 */
export class ScrapingErrorHandler {
  private static readonly logger = new Logger('ScrapingErrorHandler');

  /**
   * 오류를 적절한 스크래핑 예외로 변환
   * @param error 발생한 오류
   * @param context 오류 컨텍스트 (추가 정보)
   * @returns 변환된 스크래핑 예외
   */
  static handleError(error: any, context?: any): never {
    ScrapingErrorHandler.logger.error(
      `스크래핑 오류 발생: ${error.message}`,
      error.stack,
    );

    let exception: ScrapingException;

    // Axios 오류 처리
    if (axios.isAxiosError(error)) {
      // 타임아웃
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        exception = new TimeoutException({
          message: `요청 시간이 초과되었습니다: ${error.message}`,
          url: error.config?.url,
          method: error.config?.method,
          context,
        });
      }
      // 접근 차단
      else if (
        error.response?.status === 403 ||
        error.response?.status === 429
      ) {
        exception = new AccessBlockedException({
          message: `웹사이트에서 접근이 차단되었습니다. 잠시 후 다시 시도하세요: ${error.message}`,
          url: error.config?.url,
          status: error.response?.status,
          context,
        });
      }
      // 네트워크 오류
      else {
        exception = new NetworkException({
          message: `네트워크 연결에 실패했습니다: ${error.message}`,
          url: error.config?.url,
          method: error.config?.method,
          code: error.code,
          status: error.response?.status,
          context,
        });
      }
    }
    // 요소를 찾을 수 없는 오류
    else if (
      error.message?.includes('selector') ||
      error.message?.includes('element') ||
      error.message?.includes('XPath')
    ) {
      exception = new ElementNotFoundException({
        message: `웹페이지에서 요소를 찾을 수 없습니다: ${error.message}`,
        context,
      });
    }
    // 타임아웃 오류
    else if (
      error.name === 'TimeoutError' ||
      error.message?.includes('timeout') ||
      error.message?.includes('ETIMEDOUT')
    ) {
      exception = new TimeoutException({
        message: `요청 시간이 초과되었습니다: ${error.message}`,
        context,
      });
    }
    // 파싱 오류
    else if (
      error.message?.includes('parse') ||
      error.message?.includes('JSON') ||
      error.message?.includes('Unexpected token')
    ) {
      exception = new ParsingException({
        message: `데이터 파싱 중 오류가 발생했습니다: ${error.message}`,
        context,
      });
    }
    // 기타 오류
    else {
      exception = new ScrapingException(
        `스크래핑 중 오류가 발생했습니다: ${error.message}`,
        undefined,
        'UNEXPECTED_SCRAPING_ERROR',
        {
          name: error.name,
          context,
        },
      );
    }

    throw exception;
  }

  /**
   * try-catch 패턴에서 사용할 수 있는 스크래핑 오류 처리 래퍼 함수
   * @param fn 실행할 비동기 함수
   * @param context 오류 컨텍스트 (추가 정보)
   * @returns 함수 실행 결과
   */
  static async executeWithErrorHandling<T>(
    fn: () => Promise<T>,
    context?: any,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, context);
    }
  }

  /**
   * 재시도 로직이 포함된 스크래핑 오류 처리 래퍼 함수
   * @param fn 실행할 비동기 함수
   * @param options 재시도 옵션
   * @param context 오류 컨텍스트 (추가 정보)
   * @returns 함수 실행 결과
   */
  static async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      delayMs?: number;
      retryableErrors?: string[];
    } = {},
    context?: any,
  ): Promise<T> {
    const {
      maxRetries = 3,
      delayMs = 1000,
      retryableErrors = ['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'ACCESS_BLOCKED'],
    } = options;

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // 재시도 가능한 오류인지 확인
        const isRetryable =
          error instanceof ScrapingException &&
          retryableErrors.includes(error.errorCode);

        // 마지막 시도이거나 재시도 불가능한 오류면 즉시 실패
        if (attempt >= maxRetries || !isRetryable) {
          break;
        }

        // 재시도 전 로깅
        this.logger.warn(
          `스크래핑 시도 ${attempt}/${maxRetries} 실패, ${delayMs}ms 후 재시도합니다: ${error.message}`,
        );

        // 재시도 전 지연
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // 모든 재시도 실패
    this.handleError(lastError, {
      ...context,
      retriesAttempted: maxRetries,
    });
  }
}
