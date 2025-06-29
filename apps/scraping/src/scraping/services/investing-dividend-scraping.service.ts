import { Injectable, Logger } from '@nestjs/common';
import {
  NetworkException,
  TimeoutException,
  AccessBlockedException,
  ScrapingException,
} from '../../common/exceptions/scraping.exceptions';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapeDto } from '../dto/scrape.dto';
import { CountryCodeMap } from '../../common/constants/nation-code.constants';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';
import { formatDate, parseDate } from '../../common/utils/convert-date';

@Injectable()
export class InvestingDividendScrapingService {
  private readonly logger = new Logger(InvestingDividendScrapingService.name);
  private readonly TIMEOUT_MS = 60000;

  constructor(private readonly prisma: PrismaService) {}

  async scrape(scrapeDto: ScrapeDto): Promise<any[]> {
    try {
      const dataList = [];
      const { country, dateFrom, dateTo, proxyConfig } = scrapeDto;

      const countryCode = CountryCodeMap[country];

      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: '',
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

        requestConfig.url = url;
        requestConfig.data = urlEncodedData;

        const response = await ScrapingErrorHandler.executeWithRetry(
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
          { country, page },
        );
        const html = response.data.data;
        bind_scroll_handler = response.data.bind_scroll_handler;
        last_time_scope = response.data.last_time_scope;

        const $ = cheerio.load(html, { xmlMode: true });

        $('tr').each((index, element) => {
          try {
            const flagElement = $(element).find('.flag span');
            if (flagElement.length > 0) {
              const exDividendDateElement = $(element).find('td').eq(2);
              const exDividendDateString = exDividendDateElement.text().trim();
              const exDividendDate = parseDate(exDividendDateString).getTime();
              const dividendAmountElement = $(element).find('td').eq(3);
              const dividendAmount = dividendAmountElement.text().trim();
              const dividendYieldElement = $(element).find('td').eq(6);
              const dividendYield = dividendYieldElement.text().trim();
              const paymentDateString =
                $(element).find('td').eq(5).attr('data-value') + '000';
              const paymentDate =
                Number(paymentDateString) > 0 ? Number(paymentDateString) : 0;
              const tickerElement = $(element).find('td').eq(1).find('a');
              const ticker = tickerElement.text().trim();

              const eventData = {
                country,
                ticker,
                exDividendDate,
                dividendAmount,
                previousDividendAmount: '',
                paymentDate,
                dividendYield,
              };

              dataList.push(eventData);
            }
          } catch (error) {
            ScrapingErrorHandler.handleError(error, {
              context: 'Dividend data parsing',
              element: $(element).html(),
            });
          }
        });

        this.logger.debug('dividend Scraping...');
      }

      this.logger.debug('Scraped dividend data successfully.');
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
        'Dividend scraping failed',
        undefined,
        'DIVIDEND_SCRAPE_ERROR',
        error,
      );
    }
  }
}
