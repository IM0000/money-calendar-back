import { Injectable } from '@nestjs/common';
import { BaseParser } from './base-parser';
import * as cheerio from 'cheerio';
import { parseDate } from '../../common/utils/convert-date';
import { ScrapingErrorHandler } from '../../common/utils/scraping-error-handler.util';

@Injectable()
export class InvestingDividendParser extends BaseParser<string, any> {
  parse(html: string, country: string): any[] {
    const $ = cheerio.load(html, { xmlMode: true });
    const dataList = [];

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

    return dataList;
  }
}
