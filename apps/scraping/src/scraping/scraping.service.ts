import { Injectable, Logger, Body } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../prisma/prisma.service';
import { ScrapeDto } from '../dto/scrape.dto';
import {
  CountryCodeMap,
  CountryNameToCodeMap,
  ImportanceLevelMap,
} from '../common/constants/nation-code.constants';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * * *') // 매시간 정각에 실행
  async handleCron(scrapeDto: ScrapeDto) {
    this.logger.debug('Called when the current second is 0');
    await this.scrapeEconomicIndicator(scrapeDto);
  }

  async sleep(ms): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrapeUSACompany(): Promise<void> {
    try {
      const markets = ['NYSE', 'NASDAQ', 'AMEX'];
      const pageSize = 20;

      for (let i = 0; i < markets.length; i++) {
        let page = 1;
        let totalCount = 0;
        while (true) {
          // 요청 설정
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
            proxy: {
              host: '127.0.0.1', // 프록시 서버 주소
              port: 9090, // 프록시 서버 포트
              protocol: 'http', // 프록시 서버 프로토콜
            },
          };

          // GET 요청 보내기
          const getResponse = await axios(getRequestConfig);
          const jsonData = getResponse.data;

          // 응답 데이터 로깅
          console.log(jsonData);

          // totalCount가 0이면 응답에서 가져옴
          if (totalCount === 0) {
            totalCount = jsonData.totalCount;
          }

          // 현재 페이지의 데이터 처리
          const stocks = jsonData.stocks;
          const dataSet = stocks.map((stock: any) => ({
            ticker: stock.symbolCode,
            name: stock.stockName + '(' + stock.stockNameEng + ')',
            country: stock.nationType,
          }));

          // 데이터셋 처리 로직 추가
          this.logger.debug(dataSet);

          await this.saveCompanyData(dataSet);

          // 모든 페이지를 다 처리했으면 종료
          if (page * pageSize >= totalCount) break;

          await this.sleep(200);

          // 다음 페이지로 넘어가기
          page += 1;
          this.logger.debug('company Scraping...');
        }
      }

      this.logger.debug('USA company scraping complete');
    } catch (error) {
      this.logger.warn('Error occurred while scraping USA companies:', error);
    }
  }

  async saveCompanyData(
    companyData: { ticker: string; name: string; country: string }[],
  ) {
    for (const data of companyData) {
      try {
        // 회사 검색: ticker와 country를 기준으로 검색
        const existingCompany = await this.prisma.company.findFirst({
          where: {
            ticker: data.ticker,
            country: data.country,
          },
        });

        if (existingCompany) {
          // 회사가 존재하면 업데이트 (필요 시 업데이트할 필드 추가)
          await this.prisma.company.update({
            where: { id: existingCompany.id },
            data: {
              name: data.name, // 이름 업데이트
              updatedAt: new Date(), // 업데이트 시간 갱신
            },
          });
          console.log(`Updated company: ${data.name} (${data.ticker})`);
        } else {
          // 회사가 존재하지 않으면 새로 생성
          await this.prisma.company.create({
            data: {
              ticker: data.ticker,
              name: data.name,
              country: data.country,
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
      const { country, dateFrom, dateTo } = scrapeDto;

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
        proxy: {
          host: '127.0.0.1', // 프록시 서버 주소
          port: 9090, // 프록시 서버 포트
          protocol: 'http', // 프록시 서버 프로토콜
        },
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

        const response = await axios(requestConfig);
        const html = response.data.data;
        bind_scroll_handler = response.data.bind_scroll_handler;

        // cheerio로 파싱한 후의 HTML을 저장
        const $ = cheerio.load(html, { xmlMode: true });

        // 데이터를 담을 배열 초기화
        const dataSet = [];

        // 각 행을 순회하며 데이터 추출
        let currentDate: string;
        // 모든 tr 요소를 순회
        $('tr').each((index, element) => {
          // theDay 클래스를 가진 td가 있는 경우 날짜를 갱신
          if ($(element).find('.theDay').length > 0) {
            const theDayId = $(element).find('.theDay').attr('id');
            currentDate = theDayId.replace('theDay', '') + '000';
          }

          // js-event-item 클래스를 가진 tr만 처리
          if ($(element).hasClass('js-event-item')) {
            const time = $(element).find('.js-time').text().trim();
            let country = $(element).find('.flagCur span').attr('title').trim();
            country = CountryNameToCodeMap[country] || '미확인@' + country;
            let importance = $(element).find('.sentiment').attr('title').trim();
            importance = ImportanceLevelMap[importance];
            const eventName = $(element).find('.event a').text().trim();

            const sanitizeText = (text) =>
              text.trim() === '&nbsp;' ? '' : text.trim();

            const actual = sanitizeText($(element).find('.act').text());
            const forecast = sanitizeText($(element).find('.fore').text());
            const previous = sanitizeText($(element).find('.prev').text());

            const dateObj = new Date(Number(currentDate));
            const [hours, minutes] = time.split(':');

            // dateObj에 시간을 추가
            dateObj.setHours(Number(hours), Number(minutes));

            // 필요한 데이터 객체로 정리
            const eventData = {
              country,
              releaseDate: dateObj.getTime(),
              name: eventName,
              importance,
              actual,
              forecast,
              previous,
            };

            // 데이터를 배열에 추가
            dataSet.push(eventData);
          }
        });

        await this.saveEconomicIndicatorData(dataSet);
        // console.log(JSON.stringify(dataSet));

        this.logger.debug('economicIndicator Scraping...');
      }

      this.logger.debug('Scraped and saved economic data successfully.');
    } catch (error) {
      this.logger.error(
        'Error occurred while economic scraping website',
        error,
        error.stack,
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
        // 존재하면 업데이트
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
        // 존재하지 않으면 생성
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
      const { country, dateFrom, dateTo } = scrapeDto;

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
        proxy: {
          host: '127.0.0.1', // 프록시 서버 주소
          port: 9090, // 프록시 서버 포트
          protocol: 'http', // 프록시 서버 프로토콜
        },
      };

      let page = 0;
      let bind_scroll_handler = true;

      while (page < 200 && bind_scroll_handler) {
        const url =
          'https://kr.investing.com/earnings-calendar/Service/getCalendarFilteredData';
        const data = {
          'country[]': countryCode,
          dateFrom: formatDate(dateFrom),
          dateTo: formatDate(dateTo),
          currentTab: 'custom',
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

        const response = await axios(requestConfig);
        const html = response.data.data;
        bind_scroll_handler = response.data.bind_scroll_handler;

        // cheerio로 파싱한 후의 HTML을 저장
        const $ = cheerio.load(html, { xmlMode: true });
        const dataSet = [];
        let currentDate;

        $('tr').each((index, element) => {
          // 날짜 업데이트
          // tr 내부의 td에 theDay 클래스가 있는지 확인하여 날짜 업데이트
          const dateElement = $(element).find('td.theDay');
          if (dateElement.length > 0) {
            currentDate = dateElement.text().trim();
            currentDate = parseDate(currentDate);
          }

          // 데이터 파싱
          if ($(element).find('.earnCalCompany').length > 0) {
            const ticker = $(element).find('.earnCalCompany a').text().trim();

            // actualEPS와 forecastEPS 파싱
            let actualEPS = '';
            let forecastEPS = '';

            // eps_actual 클래스를 가진 요소를 찾고, 그 옆에 있는 요소에서 forecastEPS 추출
            const epsElement = $(element).find('td[class*="eps_actual"]');
            if (epsElement.length > 0) {
              actualEPS = epsElement.text().trim();
              const forecastEPSElement = epsElement.next('td.leftStrong');
              if (forecastEPSElement.length > 0) {
                forecastEPS =
                  forecastEPSElement.text().split('/&nbsp;&nbsp;')[1].trim() ||
                  '';
              }
            }

            // actualRevenue와 forecastRevenue 파싱
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

            // 날짜 형식 변환
            const releaseDate = currentDate.getTime();

            this.logger.debug({
              releaseDate,
              actualEPS,
              forecastEPS,
              actualRevenue,
              forecastRevenue,
              ticker,
              country,
            });

            // 데이터 객체 생성
            dataSet.push({
              releaseDate,
              actualEPS,
              forecastEPS,
              actualRevenue,
              forecastRevenue,
              ticker,
              country,
            });
          }
        });

        await this.saveEarningsData(dataSet);
        this.logger.debug('earnings Scraping...');
      }

      // previous 업데이트
      await this.updateEarningsPreviousValues();

      this.logger.debug('Scraped and saved earnings data successfully.');
    } catch (error) {
      this.logger.error(
        'Error occurred while earnings scraping website',
        error,
      );
    }
  }

  async saveEarningsData(earningsData: any[]) {
    for (const data of earningsData) {
      const company = await this.prisma.company.findFirst({
        where: {
          ticker: data.ticker, // `ticker` 값을 기준으로 검색합니다.
          country: data.country, // `country` 값을 기준으로 검색합니다.
        },
      });

      if (!company) {
        this.logger.warn(
          `Company not found for ticker: ${data.ticker} and country: ${data.country}`,
        );
        continue;
      }

      // 존재하는 수익 데이터가 있는지 조회합니다.
      const existingRecord = await this.prisma.earnings.findFirst({
        where: {
          releaseDate: data.releaseDate,
          companyId: company.id,
        },
      });

      if (existingRecord) {
        // 기존 데이터가 존재하면 업데이트
        await this.prisma.earnings.update({
          where: { id: existingRecord.id },
          data: {
            actualEPS: data.actualEPS,
            forecastEPS: data.forecastEPS,
            actualRevenue: data.actualRevenue,
            forecastRevenue: data.forecastRevenue,
          },
        });
      } else {
        // 기존 데이터가 없으면 새로운 데이터를 생성
        await this.prisma.earnings.create({
          data: {
            releaseDate: data.releaseDate,
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
    // 이전 값이 없는 레코드만 가져옵니다.
    const earningsRecords = await this.prisma.earnings.findMany({
      where: {
        previousEPS: '', // 이전 EPS가 비어있는 레코드
        previousRevenue: '', // 이전 Revenue가 비어있는 레코드
      },
      orderBy: { releaseDate: 'asc' }, // 날짜순으로 정렬하여 처리
    });

    for (const record of earningsRecords) {
      // 이전의 가장 최신 Earnings 데이터 조회
      const previousRecord = await this.prisma.earnings.findFirst({
        where: {
          companyId: record.companyId,
          releaseDate: { lt: record.releaseDate }, // 현재 레코드보다 이전인 데이터만 조회
        },
        orderBy: { releaseDate: 'desc' }, // 가장 최신의 이전 데이터만 가져옴
      });

      if (previousRecord) {
        // 이전 값이 있을 경우 업데이트
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
      const { country, dateFrom, dateTo } = scrapeDto;

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
        proxy: {
          host: '127.0.0.1', // 프록시 서버 주소
          port: 9090, // 프록시 서버 포트
          protocol: 'http', // 프록시 서버 프로토콜
        },
      };

      let page = 0;
      let bind_scroll_handler = true;

      while (page < 200 && bind_scroll_handler) {
        const url =
          'https://kr.investing.com/dividends-calendar/Service/getCalendarFilteredData';
        const data = {
          'country[]': countryCode,
          dateFrom: formatDate(dateFrom),
          dateTo: formatDate(dateTo),
          currentTab: 'custom',
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

        const response = await axios(requestConfig);
        const html = response.data.data;
        bind_scroll_handler = response.data.bind_scroll_handler;

        // cheerio로 파싱한 후의 HTML을 저장
        const $ = cheerio.load(html, { xmlMode: true });

        // 데이터를 담을 배열 초기화
        const dataSet = [];

        // 모든 tr 요소를 순회
        $('tr').each((index, element) => {
          const flagElement = $(element).find('.flag span');
          if (flagElement.length > 0) {
            const exDividendDateString = $(element)
              .find('td')
              .eq(2)
              .text()
              .trim();
            const exDividendDate = parseDate(exDividendDateString).getTime();
            const dividendAmount = $(element).find('td').eq(3).text().trim();
            const dividendYield = $(element).find('td').eq(6).text().trim();
            const paymentDateString =
              $(element).find('td').eq(5).attr('data-value') + '000';
            const paymentDate =
              Number(paymentDateString) > 0 ? Number(paymentDateString) : 0; // 없는 경우 0으로 넣음
            const ticker = $(element).find('td').eq(1).find('a').text().trim();

            // this.logger.debug(paymentDate);
            // 데이터 객체로 정리
            const eventData = {
              country,
              ticker,
              exDividendDate,
              dividendAmount,
              previousDividendAmount: '', // 이전 배당금은 주어진 데이터에서 처리할 수 없으므로 빈 값으로 설정
              paymentDate,
              dividendYield,
            };

            // 데이터를 배열에 추가
            dataSet.push(eventData);
          }
        });

        await this.saveDividendData(dataSet);

        // console.log(JSON.stringify(dataSet));
        this.logger.debug('dividend Scraping...');
      }

      await this.updateDividendPreviousValues();

      this.logger.debug('Scraped and saved dividend data successfully.');
    } catch (error) {
      this.logger.error(
        'Error occurred while dividend scraping website',
        error,
      );
    }
  }

  async saveDividendData(dividendData: any[]) {
    for (const data of dividendData) {
      // 회사 정보를 검색합니다.
      const company = await this.prisma.company.findFirst({
        where: {
          ticker: data.ticker, // `ticker` 값을 기준으로 검색합니다.
          country: data.country, // `country` 값을 기준으로 검색합니다.
        },
      });

      if (!company) {
        this.logger.warn(
          `Company not found for ticker: ${data.ticker} and country: ${data.country}`,
        );
        continue;
      }

      // 기존 배당 데이터가 있는지 조회합니다.
      const existingRecord = await this.prisma.dividend.findFirst({
        where: {
          exDividendDate: data.exDividendDate,
          companyId: company.id,
        },
      });

      if (existingRecord) {
        // 기존 데이터가 존재하면 업데이트
        await this.prisma.dividend.update({
          where: { id: existingRecord.id },
          data: {
            dividendAmount: data.dividendAmount,
            paymentDate: data.paymentDate,
            previousDividendAmount: data.previousDividendAmount,
          },
        });
      } else {
        // 기존 데이터가 없으면 새로운 데이터를 생성
        await this.prisma.dividend.create({
          data: {
            exDividendDate: data.exDividendDate,
            dividendAmount: data.dividendAmount,
            previousDividendAmount: data.previousDividendAmount,
            paymentDate: data.paymentDate,
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
    // 이전 배당금 값이 없는 레코드만 가져옵니다.
    const dividendRecords = await this.prisma.dividend.findMany({
      where: {
        previousDividendAmount: '', // 이전 배당금이 비어있는 레코드
      },
      orderBy: { exDividendDate: 'asc' }, // 배당락일 순으로 정렬하여 처리
    });

    for (const record of dividendRecords) {
      // 이전의 가장 최신 Dividend 데이터 조회
      const previousRecord = await this.prisma.dividend.findFirst({
        where: {
          companyId: record.companyId,
          exDividendDate: { lt: record.exDividendDate }, // 현재 레코드보다 이전인 데이터만 조회
        },
        orderBy: { exDividendDate: 'desc' }, // 가장 최신의 이전 데이터만 가져옴
      });

      if (previousRecord) {
        // 이전 값이 있을 경우 업데이트
        await this.prisma.dividend.update({
          where: { id: record.id },
          data: {
            previousDividendAmount: previousRecord.dividendAmount, // 이전 배당금 설정
          },
        });
      }
    }
  }
}

function formatDate(dateString: string): string {
  if (dateString.length !== 8) {
    throw new Error('Invalid date format. Expected format: YYYYMMDD');
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  return `${year}-${month}-${day}`;
}

function parseDate(dateString: string): Date {
  // "2024년 8월 2일 금요일" 형식을 Date 객체로 변환
  const [year, month, day] = dateString
    .replace('년', '')
    .replace('월', '')
    .replace('일', '')
    .split(' ')
    .map((part) => parseInt(part.trim()));

  const date = new Date(year, month - 1, day);

  return date;
}
