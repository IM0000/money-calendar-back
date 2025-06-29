import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapeDto } from '../dto/scrape.dto';
import { BaseScraper } from './base-scraper.service';
import { InvestingEconomicParser } from '../parsers/investing-economic-parser';
import { IEconomicScraper } from '../interfaces/scraper.interface';
import { CountryCodeMap } from '../../common/constants/nation-code.constants';
import { formatDate } from '../../common/utils/convert-date';

@Injectable()
export class InvestingEconomicScrapingService
  extends BaseScraper<ScrapeDto, any>
  implements IEconomicScraper
{
  constructor(
    prisma: PrismaService,
    private readonly parser: InvestingEconomicParser,
  ) {
    super(prisma);
  }

  getSourceName(): string {
    return 'investing';
  }

  async scrape(scrapeDto: ScrapeDto): Promise<any[]> {
    try {
      const dataList: any[] = [];
      const { country, dateFrom, dateTo, proxyConfig } = scrapeDto;

      const countryCode = CountryCodeMap[country];

      let page = 0;
      let bind_scroll_handler = true;

      while (page < 200 && bind_scroll_handler) {
        const currentPage = page++;
        const url =
          'https://kr.investing.com/economic-calendar/Service/getCalendarFilteredData';
        const data = {
          'country[]': countryCode,
          dateFrom: formatDate(dateFrom),
          dateTo: formatDate(dateTo),
          timeZone: 88,
          currentTab: 'custom',
          limit_from: currentPage,
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
          data: urlEncodedData,
          timeout: this.TIMEOUT_MS,
        };

        this.applyProxyConfig(requestConfig, proxyConfig);

        const response = await this.executeHttpRequest(requestConfig, {
          country,
          page,
        });

        const html = response.data.data;
        bind_scroll_handler = response.data.bind_scroll_handler;

        if (!html) {
          this.logger.debug('No more data available');
          break;
        }

        // 파서를 사용해서 HTML 파싱
        const parsedData = this.parser.parse(html);
        dataList.push(...parsedData);

        this.logger.debug('economicIndicator Scraping...');
      }

      this.logger.debug('Scraped economic data successfully.');
      this.logger.debug(dataList);
      return dataList;
    } catch (error) {
      this.handleScrapingError(error, 'Economic indicator scraping');
    }
  }
}
