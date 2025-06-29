import { Injectable, Logger } from '@nestjs/common';
import {
  NetworkException,
  TimeoutException,
  AccessBlockedException,
  ScrapingException,
} from '../../common/exceptions/scraping.exceptions';
import axios, { AxiosRequestConfig } from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { ProxyConfigDto } from '../dto/scrape.dto';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';

@Injectable()
export class NaverCompanyScrapingService {
  private readonly logger = new Logger(NaverCompanyScrapingService.name);
  private readonly TIMEOUT_MS = 60000;

  constructor(private readonly prisma: PrismaService) {}

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrape(proxyConfig?: ProxyConfigDto): Promise<any[]> {
    try {
      const dataList = [];
      const markets = ['NYSE', 'NASDAQ', 'AMEX'];
      const pageSize = 20;

      for (let i = 0; i < markets.length; i++) {
        let page = 1;
        let totalCount = 0;
        while (true) {
          const getRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `https://api.stock.naver.com/stock/exchange/${markets[i]}/marketValue?page=${page}&pageSize=${pageSize}`,
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

          const getResponse = await ScrapingErrorHandler.executeWithRetry(
            () => axios(getRequestConfig),
            {
              maxRetries: 3,
              delayMs: 1000,
              retryableErrors: [
                'NETWORK_ERROR',
                'REQUEST_TIMEOUT',
                'ACCESS_BLOCKED',
              ],
            },
            { market: markets[i], page },
          );
          const jsonData = getResponse.data;

          if (totalCount === 0) {
            totalCount = jsonData.totalCount;
          }

          const stocks = jsonData.stocks;
          const dataSet = stocks.map((stock: any) => ({
            ticker: stock.symbolCode,
            name: stock.stockName + '(' + stock.stockNameEng + ')',
            country: stock.nationType,
            marketValue: stock.marketValue,
          }));

          dataList.push(...dataSet);

          if (page * pageSize >= totalCount) break;

          await this.sleep(200);

          page += 1;
          this.logger.debug('company Scraping...');
        }
      }

      this.logger.debug('USA company scraping complete');
      return dataList;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutException(error);
        }
        if (error.response?.status === 403) {
          throw new AccessBlockedException({ response: error.response?.data });
        }
        throw new NetworkException({ message: error.message });
      }
      throw new ScrapingException(
        'USA company scraping failed',
        undefined,
        'USA_SCRAPE_ERROR',
        error,
      );
    }
  }
}
