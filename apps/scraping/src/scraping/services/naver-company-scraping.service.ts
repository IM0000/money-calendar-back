import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { ProxyConfigDto } from '../dto/scrape.dto';
import { BaseScraper } from './base-scraper.service';
import { NaverCompanyParser } from '../parsers/naver-company-parser';
import { ICompanyScraper } from '../interfaces/scraper.interface';

@Injectable()
export class NaverCompanyScrapingService
  extends BaseScraper<ProxyConfigDto | undefined, any>
  implements ICompanyScraper
{
  constructor(
    prisma: PrismaService,
    private readonly parser: NaverCompanyParser,
  ) {
    super(prisma);
  }

  getSourceName(): string {
    return 'naver';
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
          const requestConfig: AxiosRequestConfig = {
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
            timeout: this.TIMEOUT_MS,
          };

          this.applyProxyConfig(requestConfig, proxyConfig);

          const response = await this.executeHttpRequest(requestConfig, {
            market: markets[i],
            page,
          });
          const jsonData = response.data;

          if (totalCount === 0) {
            totalCount = jsonData.totalCount;
          }

          // 파서를 사용해서 JSON 데이터 파싱
          const parsedData = this.parser.parse(jsonData);
          dataList.push(...parsedData);

          if (page * pageSize >= totalCount) break;

          await this.sleep(200);
          page += 1;
          this.logger.debug('company Scraping...');
        }
      }

      this.logger.debug('USA company scraping complete');
      return dataList;
    } catch (error) {
      this.handleScrapingError(error, 'USA company scraping');
    }
  }
}
