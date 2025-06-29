import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { IScraper, ScrapingConfig } from '../interfaces/scraper.interface';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';
import {
  NetworkException,
  TimeoutException,
  AccessBlockedException,
  ScrapingException,
} from '../../common/exceptions/scraping.exceptions';

@Injectable()
export abstract class BaseScraper<TInput, TOutput>
  implements IScraper<TInput, TOutput>
{
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly TIMEOUT_MS = 60000;

  constructor(protected readonly prisma: PrismaService) {}

  abstract scrape(input: TInput): Promise<TOutput[]>;
  abstract getSourceName(): string;

  getConfig(): ScrapingConfig {
    return {
      timeout: this.TIMEOUT_MS,
      maxRetries: 3,
      delayMs: 1000,
      retryableErrors: ['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'ACCESS_BLOCKED'],
    };
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * HTTP 요청 실행 (재시도 로직 포함)
   */
  protected async executeHttpRequest(
    requestConfig: AxiosRequestConfig,
    context: any = {},
  ): Promise<any> {
    const config = this.getConfig();

    return ScrapingErrorHandler.executeWithRetry(
      () => axios(requestConfig),
      {
        maxRetries: config.maxRetries,
        delayMs: config.delayMs,
        retryableErrors: config.retryableErrors,
      },
      context,
    );
  }

  /**
   * 공통 HTTP 헤더 생성
   */
  protected createCommonHeaders(): Record<string, string> {
    return {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept: '*/*',
      'Accept-encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'ko-KR,ko;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest',
    };
  }

  /**
   * 프록시 설정 적용
   */
  protected applyProxyConfig(
    config: AxiosRequestConfig,
    proxyConfig?: { host: string; port: number; protocol?: string },
  ): AxiosRequestConfig {
    if (proxyConfig) {
      config.proxy = {
        host: proxyConfig.host,
        port: proxyConfig.port,
        protocol: proxyConfig.protocol ?? 'http',
      };
    }
    return config;
  }

  /**
   * 공통 에러 처리
   */
  protected handleScrapingError(error: any, context: string): never {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new TimeoutException(error);
      }
      if (error.response?.status === 403) {
        throw new AccessBlockedException({ response: error.response.data });
      }
      throw new NetworkException({ message: error.message });
    }

    throw new ScrapingException(
      `${context} failed`,
      undefined,
      `${context.toUpperCase()}_SCRAPE_ERROR`,
      error,
    );
  }
}
