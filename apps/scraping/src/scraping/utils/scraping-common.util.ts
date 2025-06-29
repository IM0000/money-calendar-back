import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';

export class ScrapingCommonUtil {
  /**
   * 공통 재시도 설정
   */
  static readonly DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    delayMs: 1000,
    retryableErrors: ['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'ACCESS_BLOCKED'],
  };

  /**
   * 스크래핑 요청 실행 (재시도 포함)
   */
  static async executeWithRetry<T>(
    requestFunction: () => Promise<T>,
    context: Record<string, any>,
  ): Promise<T> {
    return ScrapingErrorHandler.executeWithRetry(
      requestFunction,
      this.DEFAULT_RETRY_CONFIG,
      context,
    );
  }

  /**
   * 텍스트 정리 유틸리티 (경제지표용)
   */
  static sanitizeText(text: string): string {
    return text.trim() === '&nbsp;' ? '' : text.trim();
  }

  /**
   * 페이지네이션 제한
   */
  static readonly MAX_PAGES = 200;

  /**
   * 기본 슬립 시간 (밀리초)
   */
  static readonly DEFAULT_SLEEP_MS = 200;
}
