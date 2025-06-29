import { Injectable, Logger } from '@nestjs/common';
import {
  NetworkException,
  TimeoutException,
  AccessBlockedException,
  ScrapingException,
  ElementNotFoundException,
} from '../../common/exceptions/scraping.exceptions';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapeDto } from '../dto/scrape.dto';
import { CountryCodeMap } from '../../common/constants/nation-code.constants';
import { ReleaseTiming } from '@prisma/client';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';
import { formatDate, parseDate } from '../../common/utils/convert-date';

@Injectable()
export class InvestingEarningsScrapingService {
  private readonly logger = new Logger(InvestingEarningsScrapingService.name);
  private readonly TIMEOUT_MS = 60000;

  constructor(private readonly prisma: PrismaService) {}

  async scrape(scrapeDto: ScrapeDto): Promise<any[]> {
    try {
      const dataList = [];
      const { country, dateFrom, dateTo, proxyConfig } = scrapeDto;
      console.log(
        `🚀 ~ InvestingEarningsScrapingService ~ scrape ~ { country, dateFrom, dateTo, proxyConfig }:`,
        { country, dateFrom, dateTo, proxyConfig },
      );

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
          'https://kr.investing.com/earnings-calendar/Service/getCalendarFilteredData';
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
          .map((key) => {
            if (data[key] != 'undefined' || data[key] != '') {
              return `${encodeURIComponent(key)}=${encodeURIComponent(
                String(data[key]),
              )}`;
            }
          })
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
        let currentDate;

        $('tr').each((index, element) => {
          try {
            const dateElement = $(element).find('td.theDay');
            if (dateElement.length > 0) {
              currentDate = dateElement.text().trim();
              currentDate = parseDate(currentDate);
            }

            if ($(element).find('.earnCalCompany').length > 0) {
              const tickerElement = $(element).find('.earnCalCompany a');
              if (!tickerElement.length) {
                throw new ElementNotFoundException(
                  '티커 정보를 찾을 수 없습니다',
                );
              }
              const ticker = tickerElement.text().trim();

              let actualEPS = '';
              let forecastEPS = '';

              // eps_actual 클래스를 가진 요소를 찾고, 그 옆에 있는 요소에서 forecastEPS 추출
              const epsElement = $(element).find('td[class*="eps_actual"]');
              if (epsElement.length > 0) {
                actualEPS = epsElement.text().trim();
                const forecastEPSElement = epsElement.next('td.leftStrong');
                if (forecastEPSElement.length > 0) {
                  forecastEPS =
                    forecastEPSElement
                      .text()
                      .split('/&nbsp;&nbsp;')[1]
                      .trim() || '';
                }
              }

              let actualRevenue = '';
              let forecastRevenue = '';

              // rev_actual 클래스를 가진 요소를 찾고, 그 옆에 있는 요소에서 forecastRevenue 추출
              const revElement = $(element).find('td[class*="rev_actual"]');
              if (revElement.length > 0) {
                actualRevenue = revElement.text().trim();
                const forecastRevenueElement = revElement.next('td.leftStrong');
                if (forecastRevenueElement.length > 0) {
                  forecastRevenue =
                    forecastRevenueElement
                      .text()
                      .split('/&nbsp;&nbsp;')[1]
                      .trim() || '';
                }
              }

              let releaseTiming = '';
              const releaseTimingElement = $(element).find(
                'td.right.time span.genToolTip',
              );
              if (releaseTimingElement.length > 0) {
                releaseTiming =
                  releaseTimingElement.attr('data-tooltip')?.trim() || '';
              }

              if (releaseTiming === '개장 전') {
                releaseTiming = ReleaseTiming.PRE_MARKET;
              } else if (releaseTiming === '폐장 후') {
                releaseTiming = ReleaseTiming.POST_MARKET;
              } else {
                releaseTiming = ReleaseTiming.UNKNOWN;
              }

              const releaseDate = currentDate.getTime();

              dataList.push({
                releaseDate,
                releaseTiming,
                actualEPS,
                forecastEPS,
                actualRevenue,
                forecastRevenue,
                ticker,
                country,
              });
            }
          } catch (error) {
            ScrapingErrorHandler.handleError(error, {
              context: 'Earnings data parsing',
              element: $(element).html(),
            });
          }
        });

        this.logger.debug('earnings Scraping...');
      }

      this.logger.debug('Scraped earnings data successfully.');
      return dataList;
    } catch (error) {
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
        'Earnings scraping failed',
        undefined,
        'EARNINGS_SCRAPE_ERROR',
        error,
      );
    }
  }
}
