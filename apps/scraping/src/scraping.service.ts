import { Injectable, Logger, Body } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from './prisma/prisma.service';
import { ScrapeDto } from './dto/scrape.dto';
import {
  CountryCodeMap,
  CountryNameToCodeMap,
  ImportanceLevelMap,
} from './common/constants/nation-code.constants';
import * as fs from 'fs';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * * *') // 매시간 정각에 실행
  async handleCron(scrapeDto: ScrapeDto) {
    this.logger.debug('Called when the current second is 0');
    await this.scrapeEconomicIndicator(scrapeDto);
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
          port: 8866, // 프록시 서버 포트
          protocol: 'http', // 프록시 서버 프로토콜
        },
      };

      const url =
        'https://kr.investing.com/economic-calendar/Service/getCalendarFilteredData';
      const data = {
        'country[]': countryCode,
        dateFrom: formatDate(dateFrom),
        dateTo: formatDate(dateTo),
        timeZone: 88,
        currentTab: 'custom',
        // timeFilter: 'timeRemain',
        limit_from: 0,
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

      // cheerio로 파싱한 후의 HTML을 파일로 저장
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
          dateObj.setHours(Number(hours) + 9, Number(minutes));

          // 필요한 데이터 객체로 정리
          const eventData = {
            country,
            releaseDate: dateObj,
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

      for (const data of dataSet) {
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

      // console.log(JSON.stringify(dataSet));

      this.logger.debug('Scraped and saved economic data successfully.');
    } catch (error) {
      this.logger.error(
        'Error occurred while economic scraping website',
        error,
      );
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
          port: 8866, // 프록시 서버 포트
          protocol: 'http', // 프록시 서버 프로토콜
        },
      };

      let page = 0;
      let bind_scroll_handler = true;

      while (page < 300 && bind_scroll_handler) {
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

        // cheerio로 파싱한 후의 HTML을 파일로 저장
        const $ = cheerio.load(html, { xmlMode: true });
      }

      this.logger.debug('Scraped and saved earnings data successfully.');
    } catch (error) {
      this.logger.error(
        'Error occurred while earnings scraping website',
        error,
      );
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
