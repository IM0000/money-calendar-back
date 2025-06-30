import { ScrapeDto, ProxyConfigDto } from '../dto/scrape.dto';

export interface ScrapingConfig {
  timeout: number;
  maxRetries: number;
  delayMs: number;
  retryableErrors: string[];
}

/**
 * 모든 스크래핑 서비스가 구현해야 하는 기본 인터페이스
 * 기존 DTO를 그대로 사용하여 단순성 유지
 */
export interface IScraper<TInput = any, TOutput = any> {
  /**
   * 스크래핑 실행
   */
  scrape(input: TInput): Promise<TOutput[]>;

  /**
   * 스크래핑 설정 반환
   */
  getConfig(): ScrapingConfig;

  /**
   * 데이터 소스 이름 반환 (예: 'naver', 'investing')
   */
  getSourceName(): string;
}

// 구체적인 스크래퍼 타입들 (기존 DTO 사용)
export type ICompanyScraper = IScraper<ProxyConfigDto | undefined, any>;
export type IEconomicScraper = IScraper<ScrapeDto, any>;
export type IEarningsScraper = IScraper<ScrapeDto, any>;
export type IDividendScraper = IScraper<ScrapeDto, any>;
