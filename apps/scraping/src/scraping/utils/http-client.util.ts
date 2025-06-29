import { AxiosRequestConfig } from 'axios';
import { ProxyConfigDto } from '../dto/scrape.dto';

export class HttpClientUtil {
  static readonly TIMEOUT_MS = 60000;

  /**
   * Naver API용 기본 HTTP 설정
   */
  static getNaverApiConfig(proxyConfig?: ProxyConfigDto): AxiosRequestConfig {
    return {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        accept: 'application/json',
        'sec-ch-ua':
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        origin: 'https://m.stock.naver.com',
        referer:
          'https://m.stock.naver.com/worldstock/home/USA/marketValue/NYSE',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        connection: 'keep-alive',
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
   * Investing.com API용 기본 HTTP 설정
   */
  static getInvestingApiConfig(
    proxyConfig?: ProxyConfigDto,
  ): AxiosRequestConfig {
    return {
      method: 'post',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Accept-encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'XMLHttpRequest',
        Referer: 'https://kr.investing.com/',
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
   * 공통 슬립 유틸리티
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * URL 인코딩된 데이터 생성
   */
  static createUrlEncodedData(data: Record<string, any>): string {
    return Object.keys(data)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]))}`,
      )
      .join('&');
  }

  /**
   * 필터링된 URL 인코딩된 데이터 생성 (earnings용)
   */
  static createFilteredUrlEncodedData(data: Record<string, any>): string {
    return Object.keys(data)
      .map((key) => {
        if (data[key] != 'undefined' || data[key] != '') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(
            String(data[key]),
          )}`;
        }
      })
      .join('&');
  }
}
