import { Injectable, Logger, Body } from '@nestjs/common';
import {
  NetworkException,
  TimeoutException,
  AccessBlockedException,
  ScrapingException,
} from '../common/exceptions/scraping.exceptions';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../prisma/prisma.service';
import { ProxyConfigDto, ScrapeDto } from './dto/scrape.dto';
import {
  CountryCodeMap,
  CountryNameToCodeMap,
  ImportanceLevelMap,
} from '../common/constants/nation-code.constants';
import { ReleaseTiming } from '@prisma/client';
import { ScrapingErrorHandler } from '../common/utils/scraping-error-handler.util';
import { ElementNotFoundException } from '../common/exceptions/scraping.exceptions';
import { formatDate, parseDate } from '../common/utils/convert-date';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  constructor(private readonly prisma: PrismaService) {}

  async sleep(ms): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrapeUSACompany(proxyConfig?: ProxyConfigDto): Promise<void> {
    try {
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

          // this.logger.debug(dataSet);

          await this.saveCompanyData(dataSet);

          if (page * pageSize >= totalCount) break;

          await this.sleep(200);

          page += 1;
          this.logger.debug('company Scraping...');
        }
      }

      this.logger.debug('USA company scraping complete');
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

  async saveCompanyData(
    companyData: {
      ticker: string;
      name: string;
      country: string;
      marketValue: string;
    }[],
  ) {
    for (const data of companyData) {
      try {
        const existingCompany = await this.prisma.company.findFirst({
          where: {
            ticker: data.ticker,
            country: data.country,
          },
        });

        if (existingCompany) {
          await this.prisma.company.update({
            where: { id: existingCompany.id },
            data: {
              name: data.name,
              marketValue: data.marketValue,
              updatedAt: new Date(),
            },
          });
          console.log(`Updated company: ${data.name} (${data.ticker})`);
        } else {
          await this.prisma.company.create({
            data: {
              ticker: data.ticker,
              name: data.name,
              country: data.country,
              marketValue: data.marketValue,
            },
          });
          console.log(`Created new company: ${data.name} (${data.ticker})`);
        }
      } catch (error) {
        console.error(`Error saving company data for ${data.ticker}:`, error);
      }
    }
  }

  async scrapeEconomicIndicator(scrapeDto: ScrapeDto): Promise<void> {
    try {
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
        bind_scroll_handler = response.data.bind_scroll_handler;

        const $ = cheerio.load(html, { xmlMode: true });

        const dataSet = [];

        let currentDate: string;
        $('tr').each((index, element) => {
          try {
            if ($(element).find('.theDay').length > 0) {
              const theDayId = $(element).find('.theDay').attr('id');
              if (!theDayId) {
                throw new ElementNotFoundException(
                  '날짜 ID를 찾을 수 없습니다',
                );
              }
              currentDate = theDayId.replace('theDay', '') + '000';
            }

            if ($(element).hasClass('js-event-item')) {
              const time = $(element).find('.js-time').text().trim();
              const countryElement = $(element).find('.flagCur span');
              let country = countryElement.attr('title')?.trim();
              country = CountryNameToCodeMap[country] || '미확인@' + country;
              let importance = $(element)
                .find('.sentiment')
                .attr('title')
                .trim();
              importance = ImportanceLevelMap[importance];
              const eventName = $(element).find('.event a').text().trim();

              const sanitizeText = (text) =>
                text.trim() === '&nbsp;' ? '' : text.trim();

              const actual = sanitizeText($(element).find('.act').text());
              const forecast = sanitizeText($(element).find('.fore').text());
              const previous = sanitizeText($(element).find('.prev').text());

              const dateObj = new Date(Number(currentDate));
              const [hours, minutes] = time.split(':');

              dateObj.setHours(Number(hours), Number(minutes));

              const eventData = {
                country,
                releaseDate: dateObj.getTime(),
                name: eventName,
                importance,
                actual,
                forecast,
                previous,
              };
              this.logger.log(eventData);
              dataSet.push(eventData);
            }
          } catch (error) {
            ScrapingErrorHandler.handleError(error, {
              context: 'Economic indicator data parsing',
              element: $(element).html(),
            });
          }
        });

        await this.saveEconomicIndicatorData(dataSet);

        this.logger.debug('economicIndicator Scraping...');
      }

      this.logger.debug('Scraped and saved economic data successfully.');
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
        'Economic indicator scraping failed',
        undefined,
        'ECONOMIC_INDICATOR_SCRAPE_ERROR',
        error,
      );
    }
  }

  async saveEconomicIndicatorData(economicIndicators: any[]) {
    for (const data of economicIndicators) {
      const existingRecord = await this.prisma.economicIndicator.findFirst({
        where: {
          name: data.name,
          country: data.country,
          releaseDate: data.releaseDate,
        },
      });

      if (existingRecord) {
        await this.prisma.economicIndicator.update({
          where: { id: existingRecord.id },
          data: {
            importance: data.importance,
            actual: data.actual,
            forecast: data.forecast,
            previous: data.previous,
          },
        });
      } else {
        await this.prisma.economicIndicator.create({
          data: {
            country: data.country,
            releaseDate: data.releaseDate,
            name: data.name,
            importance: data.importance,
            actual: data.actual,
            forecast: data.forecast,
            previous: data.previous,
          },
        });
      }
    }
  }

  async scrapeEarnings(scrapeDto: ScrapeDto): Promise<void> {
    try {
      const { country, dateFrom, dateTo, proxyConfig } = scrapeDto;
      console.log(
        `🚀 ~ ScrapingService ~ scrapeEarnings ~ { country, dateFrom, dateTo, proxyConfig }:`,
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
        const dataSet = [];
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

              // this.logger.debug({
              //   releaseDate,
              //   releaseTiming,
              //   actualEPS,
              //   forecastEPS,
              //   actualRevenue,
              //   forecastRevenue,
              //   ticker,
              //   country,
              // });

              dataSet.push({
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

        await this.saveEarningsData(dataSet);
        this.logger.debug('earnings Scraping...');
      }

      await this.updateEarningsPreviousValues();

      this.logger.debug('Scraped and saved earnings data successfully.');
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

  async saveEarningsData(earningsData: any[]) {
    // this.logger.debug('earningsData', earningsData);
    for (const data of earningsData) {
      const company = await this.prisma.company.findFirst({
        where: {
          ticker: data.ticker,
          country: data.country,
        },
      });

      if (!company) {
        // this.logger.warn(
        //   `Company not found for ticker: ${data.ticker} and country: ${data.country}`,
        // );
        continue;
      }

      const existingRecord = await this.prisma.earnings.findFirst({
        where: {
          releaseDate: data.releaseDate,
          companyId: company.id,
        },
      });

      if (existingRecord) {
        await this.prisma.earnings.update({
          where: { id: existingRecord.id },
          data: {
            releaseTiming: data.releaseTiming,
            actualEPS: data.actualEPS,
            forecastEPS: data.forecastEPS,
            actualRevenue: data.actualRevenue,
            forecastRevenue: data.forecastRevenue,
          },
        });
      } else {
        await this.prisma.earnings.create({
          data: {
            releaseDate: data.releaseDate,
            releaseTiming: data.releaseTiming,
            actualEPS: data.actualEPS,
            forecastEPS: data.forecastEPS,
            previousEPS: '',
            actualRevenue: data.actualRevenue,
            forecastRevenue: data.forecastRevenue,
            previousRevenue: '',
            company: {
              connect: { id: company.id },
            },
            country: data.country,
          },
        });
      }
    }
  }

  async updateEarningsPreviousValues() {
    const earningsRecords = await this.prisma.earnings.findMany({
      where: {
        previousEPS: '',
        previousRevenue: '',
      },
      orderBy: { releaseDate: 'asc' },
    });

    for (const record of earningsRecords) {
      const previousRecord = await this.prisma.earnings.findFirst({
        where: {
          companyId: record.companyId,
          releaseDate: { lt: record.releaseDate }, // 현재 레코드보다 이전인 데이터만 조회
        },
        orderBy: { releaseDate: 'desc' },
      });

      if (previousRecord) {
        await this.prisma.earnings.update({
          where: { id: record.id },
          data: {
            previousEPS: previousRecord.actualEPS,
            previousRevenue: previousRecord.actualRevenue,
          },
        });
      }
    }
  }

  async scrapeDividend(scrapeDto: ScrapeDto): Promise<void> {
    try {
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

        const dataSet = [];

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

              dataSet.push(eventData);
            }
          } catch (error) {
            ScrapingErrorHandler.handleError(error, {
              context: 'Dividend data parsing',
              element: $(element).html(),
            });
          }
        });

        await this.saveDividendData(dataSet);

        this.logger.debug('dividend Scraping...');
      }

      await this.updateDividendPreviousValues();

      this.logger.debug('Scraped and saved dividend data successfully.');
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

  async saveDividendData(dividendData: any[]) {
    for (const data of dividendData) {
      const company = await this.prisma.company.findFirst({
        where: {
          ticker: data.ticker,
          country: data.country,
        },
      });

      if (!company) {
        // this.logger.warn(
        //   `Company not found for ticker: ${data.ticker} and country: ${data.country}`,
        // );
        continue;
      }

      const existingRecord = await this.prisma.dividend.findFirst({
        where: {
          exDividendDate: data.exDividendDate,
          companyId: company.id,
        },
      });

      if (existingRecord) {
        await this.prisma.dividend.update({
          where: { id: existingRecord.id },
          data: {
            dividendAmount: data.dividendAmount,
            paymentDate: data.paymentDate,
            previousDividendAmount: data.previousDividendAmount,
            dividendYield: data.dividendYield,
          },
        });
      } else {
        await this.prisma.dividend.create({
          data: {
            exDividendDate: data.exDividendDate,
            dividendAmount: data.dividendAmount,
            previousDividendAmount: data.previousDividendAmount,
            paymentDate: data.paymentDate,
            dividendYield: data.dividendYield,
            company: {
              connect: { id: company.id },
            },
            country: data.country,
          },
        });
      }
    }
  }

  async updateDividendPreviousValues() {
    const dividendRecords = await this.prisma.dividend.findMany({
      where: {
        previousDividendAmount: '',
      },
      orderBy: { exDividendDate: 'asc' },
    });

    for (const record of dividendRecords) {
      const previousRecord = await this.prisma.dividend.findFirst({
        where: {
          companyId: record.companyId,
          exDividendDate: { lt: record.exDividendDate },
        },
        orderBy: { exDividendDate: 'desc' },
      });

      if (previousRecord) {
        await this.prisma.dividend.update({
          where: { id: record.id },
          data: {
            previousDividendAmount: previousRecord.dividendAmount,
          },
        });
      }
    }
  }
}
