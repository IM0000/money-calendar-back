import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapeDto } from '../dto/scrape.dto';
import { CountryCodeMap } from '../../common/constants/nation-code.constants';
import { formatDate } from '../../common/utils/convert-date';
import { BaseScraper } from './base-scraper.service';
import { InvestingDividendParser } from '../parsers/investing-dividend-parser';
import { IDividendScraper } from '../interfaces/scraper.interface';

@Injectable()
export class InvestingDividendScrapingService
  extends BaseScraper<ScrapeDto, any>
  implements IDividendScraper
{
  constructor(
    prisma: PrismaService,
    private readonly parser: InvestingDividendParser,
  ) {
    super(prisma);
  }

  getSourceName(): string {
    return 'investing';
  }

  async scrape(scrapeDto: ScrapeDto): Promise<any[]> {
    try {
      const dataList = [];
      const { country, dateFrom, dateTo, proxyConfig } = scrapeDto;

      const countryCode = CountryCodeMap[country];

      let page = 0;
      let bind_scroll_handler = true;
      let last_time_scope = undefined;

      while (page < 200 && bind_scroll_handler) {
        const url =
          'https://kr.investing.com/dividends-calendar/Service/getCalendarFilteredData';
        const data = {
          'country[]': countryCode,
          dateFrom: formatDate(dateFrom),
          dateTo: formatDate(dateTo),
          currentTab: 'custom',
          limit_from: page++,
          submitFilters: page === 1 ? 1 : 0,
          byHandler: page === 1 ? '' : bind_scroll_handler,
          last_time_scope: page === 1 ? '' : last_time_scope,
        };

        const urlEncodedData = Object.keys(data)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                String(data[key]),
              )}`,
          )
          .join('&');

        const requestConfig: AxiosRequestConfig = {
          method: 'post',
          url,
          data: urlEncodedData,
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
          timeout: this.TIMEOUT_MS,
        };

        this.applyProxyConfig(requestConfig, proxyConfig);

        const response = await this.executeHttpRequest(requestConfig, {
          country,
          page,
        });
        const html = response.data.data;
        bind_scroll_handler = response.data.bind_scroll_handler;
        last_time_scope = response.data.last_time_scope;

        // 파서를 사용해서 HTML 파싱
        const parsedData = this.parser.parse(html, country);
        dataList.push(...parsedData);

        this.logger.debug('dividend Scraping...');
      }

      this.logger.debug('Scraped dividend data successfully.');
      return dataList;
    } catch (error) {
      this.handleScrapingError(error, 'Dividend scraping');
    }
  }
}
