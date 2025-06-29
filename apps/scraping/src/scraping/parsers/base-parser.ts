import { Logger } from '@nestjs/common';

export abstract class BaseParser<TInput, TOutput> {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * 데이터를 파싱하여 배열로 변환 (HTML, JSON 등)
   */
  abstract parse(data: TInput, additionalData?: any): TOutput[];

  /**
   * 텍스트 정리 유틸리티
   */
  protected sanitizeText(text: string): string {
    return text?.trim() === '&nbsp;' ? '' : text?.trim() || '';
  }

  /**
   * 에러 처리 유틸리티
   */
  protected handleParsingError(
    error: Error,
    context: string,
    element?: string,
  ): void {
    this.logger.error(`Parsing error in ${context}: ${error.message}`, {
      context,
      element: element?.substring(0, 200), // 너무 긴 HTML은 잘라서 로깅
      stack: error.stack,
    });
  }
}
