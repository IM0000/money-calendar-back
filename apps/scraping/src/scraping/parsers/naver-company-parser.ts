import { Injectable } from '@nestjs/common';
import { BaseParser } from './base-parser';

@Injectable()
export class NaverCompanyParser extends BaseParser<any, any> {
  parse(jsonData: any): any[] {
    const stocks = jsonData.stocks;
    return stocks.map((stock: any) => ({
      ticker: stock.symbolCode,
      name: stock.stockName + '(' + stock.stockNameEng + ')',
      country: stock.nationType,
      marketValue: stock.marketValue,
    }));
  }
}
