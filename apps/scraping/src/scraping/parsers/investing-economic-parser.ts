import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { BaseParser } from './base-parser';
import {
  CountryNameToCodeMap,
  ImportanceLevelMap,
} from '../../common/constants/nation-code.constants';
import { ElementNotFoundException } from '../../common/exceptions/scraping.exceptions';

@Injectable()
export class InvestingEconomicParser extends BaseParser<string, any> {
  parse(html: string): any[] {
    const dataList: any[] = [];
    const $ = cheerio.load(html, { xmlMode: true });

    let currentDate: string;
    $('tr').each((index, element) => {
      try {
        // 날짜 처리
        if ($(element).find('.theDay').length > 0) {
          const theDayId = $(element).find('.theDay').attr('id');
          if (!theDayId) {
            throw new ElementNotFoundException('날짜 ID를 찾을 수 없습니다');
          }
          currentDate = theDayId.replace('theDay', '') + '000';
        }

        // 이벤트 데이터 처리
        if ($(element).hasClass('js-event-item')) {
          const time = $(element).find('.js-time').text().trim();
          const countryElement = $(element).find('.flagCur span');
          let country = countryElement.attr('title')?.trim();
          country = CountryNameToCodeMap[country] || '미확인@' + country;

          let importance = $(element).find('.sentiment').attr('title')?.trim();
          importance = ImportanceLevelMap[importance];

          const eventName = $(element).find('.event a').text().trim();
          const baseName = eventName.replace(/\s*\([^)]+\)\s*$/, ''); // 마지막 "(5월)" 패턴 제거

          const actual = this.sanitizeText($(element).find('.act').text());
          const forecast = this.sanitizeText($(element).find('.fore').text());
          const previous = this.sanitizeText($(element).find('.prev').text());

          if (currentDate) {
            const dateObj = new Date(Number(currentDate));
            const [hours, minutes] = time.split(':');
            dateObj.setHours(Number(hours), Number(minutes));

            dataList.push({
              country,
              releaseDate: dateObj.getTime(),
              name: eventName,
              baseName,
              importance,
              actual,
              forecast,
              previous,
            });
          }
        }
      } catch (error) {
        this.handleParsingError(
          error,
          'Economic indicator data parsing',
          $(element).html(),
        );
      }
    });

    return dataList;
  }
}
