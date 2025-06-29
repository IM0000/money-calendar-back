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
import {
  CountryCodeMap,
  ImportanceLevelMap,
} from '../../common/constants/nation-code.constants';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';
import { formatDate, parseDate } from '../../common/utils/convert-date';

@Injectable()
export class InvestingEconomicScrapingService {
  private readonly logger = new Logger(InvestingEconomicScrapingService.name);
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

      while (page < 200 && bind_scroll_handler) {
        const url =
          'https://kr.investing.com/economic-calendar/Service/getCalendarFilteredData';
        const data = {
          'country[]': countryCode,
          dateFrom: formatDate(dateFrom),
          dateTo: formatDate(dateTo),
          timeZone: 88,
          currentTab: 'custom',
          // timeFilter: 'timeRemain',
          limit_from: page++,
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

        if (!html) {
          bind_scroll_handler = false;
          break;
        }

        const $ = cheerio.load(html, { xmlMode: true });
        let currentDate;

        $('tr').each((index, element) => {
          try {
            const dateElement = $(element).find('td.first.left');
            if (dateElement.length > 0) {
              currentDate = dateElement.text().trim();
              currentDate = parseDate(currentDate);
            }

            const flagElement = $(element).find('.flag');
            if (flagElement.length > 0) {
              const nameElement = $(element).find('td.left.event a');
              if (!nameElement.length) {
                throw new ElementNotFoundException(
                  '이벤트 이름을 찾을 수 없습니다',
                );
              }
              const name = nameElement.text().trim();

              const importanceElement = $(element).find('td.textNum');
              const importanceLevel = importanceElement.length;

              const timeElement = $(element).find('td.time');
              let time = timeElement.text().trim();
              if (time === 'All Day') {
                time = '00:00';
              }

              const sanitizeText = (text) =>
                text.trim() === '&nbsp;' ? '' : text.trim();

              const actualElement = $(element).find('td.bold.blackFont');
              const actual = sanitizeText(actualElement.text());

              const forecastElement = actualElement.next('td');
              const forecast = sanitizeText(forecastElement.text());

              const previousElement = forecastElement.next('td');
              const previous = sanitizeText(previousElement.text());

              const eventData = {
                releaseDate: currentDate.getTime(),
                time,
                name,
                country,
                importanceLevel: ImportanceLevelMap[importanceLevel] || 'LOW',
                actual,
                forecast,
                previous,
              };

              dataList.push(eventData);
            }
          } catch (error) {
            ScrapingErrorHandler.handleError(error, {
              context: 'Economic indicator parsing',
              element: $(element).html(),
            });
          }
        });

        this.logger.debug('economic indicator Scraping...');
      }

      this.logger.debug('Scraped economic indicator data successfully.');
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
        'Economic indicator scraping failed',
        undefined,
        'ECONOMIC_INDICATOR_SCRAPE_ERROR',
        error,
      );
    }
  }
}
