import { Injectable } from '@nestjs/common';
import { BaseParser } from './base-parser';
import * as cheerio from 'cheerio';
import { ReleaseTiming } from '@prisma/client';
import { parseDate } from '../../common/utils/convert-date';
import { ElementNotFoundException } from '../../common/exceptions/scraping.exceptions';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';

@Injectable()
export class InvestingEarningsParser extends BaseParser<string, any> {
  parse(html: string, country: string): any[] {
    const $ = cheerio.load(html, { xmlMode: true });
    const dataList = [];
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
            throw new ElementNotFoundException('티커 정보를 찾을 수 없습니다');
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
                forecastEPSElement.text().split('/&nbsp;&nbsp;')[1].trim() ||
                '';
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

    return dataList;
  }
}
