import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ProxyConfigDto } from '../dto/scrape.dto';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';
import {
  NetworkException,
  TimeoutException,
  AccessBlockedException,
  ScrapingException,
} from '../../common/exceptions/scraping.exceptions';

export class HttpClientUtil {
  private static readonly TIMEOUT_MS = 60000;

  /**
   * 기본 HTTP 헤더 설정 (GET 요청용)
   */
  static getDefaultHeaders(): Record<string, string> {
    return {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      accept: 'application/json',
      'sec-ch-ua':
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      connection: 'keep-alive',
    };
  }

  /**
   * Investing.com 사이트용 HTTP 헤더 설정 (POST 요청용)
   */
  static getInvestingHeaders(): Record<string, string> {
    return {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept: '*/*',
      'Accept-encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'ko-KR,ko;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest',
      Referer: 'https://kr.investing.com/',
    };
  }

  /**
   * Naver API용 HTTP 설정 생성
   */
  static createNaverRequestConfig(
    url: string,
    proxyConfig?: ProxyConfigDto,
  ): AxiosRequestConfig {
    return {
      method: 'get',
      url,
      headers: {
        ...this.getDefaultHeaders(),
        origin: 'https://m.stock.naver.com',
        referer:
          'https://m.stock.naver.com/worldstock/home/USA/marketValue/NYSE',
      },
      ...(proxyConfig && {
        proxy: {
          host: proxyConfig.host,
          port: proxyConfig.port,
          protocol: proxyConfig.protocol ?? 'http',
        },
      }),
      timeout: this.TIMEOUT_MS,
    };
  }

  /**
   * Investing.com용 HTTP 설정 생성
   */
  static createInvestingRequestConfig(
    proxyConfig?: ProxyConfigDto,
  ): AxiosRequestConfig {
    return {
      method: 'post',
      url: '',
      headers: this.getInvestingHeaders(),
      ...(proxyConfig && {
        proxy: {
          host: proxyConfig.host,
          port: proxyConfig.port,
          protocol: proxyConfig.protocol ?? 'http',
        },
      }),
      timeout: this.TIMEOUT_MS,
    };
  }

  /**
   * URL 인코딩된 데이터 생성
   */
  static createUrlEncodedData(data: Record<string, any>): string {
    return Object.keys(data)
      .map((key) => {
        const value = data[key];
        if (value !== undefined && value !== '') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(
            String(value),
          )}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('&');
  }

  /**
   * 재시도 로직과 에러 처리가 포함된 HTTP 요청 실행
   */
  static async executeRequest<T = any>(
    requestConfig: AxiosRequestConfig,
    context?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    try {
      return await ScrapingErrorHandler.executeWithRetry(
        () => axios(requestConfig),
        {
          maxRetries: 3,
          delayMs: 1000,
          retryableErrors: [
            'NETWORK_ERROR',
            'REQUEST_TIMEOUT',
            'ACCESS_BLOCKED',
          ],
        },
        context,
      );
    } catch (error) {
      this.handleHttpError(error);
      throw error; // 이 라인은 실행되지 않지만 타입 안전성을 위해 필요
    }
  }

  /**
   * HTTP 에러 처리
   */
  private static handleHttpError(error: any): void {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new TimeoutException(error);
      }
      if (error.response?.status === 403) {
        throw new AccessBlockedException({
          response: error.response?.data,
        });
      }
      throw new NetworkException({ message: error.message });
    }
    throw new ScrapingException(
      'HTTP request failed',
      undefined,
      'HTTP_ERROR',
      error,
    );
  }

  /**
   * 딜레이 유틸리티
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
