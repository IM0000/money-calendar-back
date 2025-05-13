import { Body, Controller, Post } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapeCompanyDto, ScrapeDto } from './dto/scrape.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScrapingResponse } from '../common/interceptors/scraping-logging.interceptor';
import { ExceptionResponse } from '../common/filters/all-exceptions.filter';
import { PersistenceService } from '../persistence/persistence.service';
import * as fs from 'fs';

@ApiTags('스크래핑')
@Controller('scraping')
export class ScrapingController {
  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly persistenceService: PersistenceService,
  ) {}

  @ApiOperation({
    summary: '경제지표 스크래핑',
    description: '지정된 기간 동안의 경제지표 데이터를 스크래핑합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스크래핑 성공',
    type: ScrapingResponse,
  })
  @ApiResponse({
    status: 500,
    description: '스크래핑 실패',
    type: ExceptionResponse,
  })
  @Post('economic-indicator')
  async scrapeEconomicIndicator(
    @Body() scrapeDto: ScrapeDto,
  ): Promise<ScrapingResponse<null>> {
    const dataList = await this.scrapingService.scrapeEconomicIndicator(
      scrapeDto,
    );
    await this.persistenceService.saveEconomicIndicatorData(dataList);
    return { message: 'Scraping completed' };
  }

  @ApiOperation({
    summary: '기업 정보 스크래핑',
    description: '지정된 국가의 기업 정보를 스크래핑합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스크래핑 성공',
    type: ScrapingResponse,
  })
  @ApiResponse({
    status: 500,
    description: '스크래핑 실패',
    type: ExceptionResponse,
  })
  @Post('company')
  async scrapeCompany(
    @Body() scrapeCompanyDto: ScrapeCompanyDto,
  ): Promise<ScrapingResponse<null>> {
    const { country, proxyConfig } = scrapeCompanyDto;

    let dataList;
    if (country === 'USA') {
      dataList = await this.scrapingService.scrapeUSACompany(proxyConfig);
    }
    await this.persistenceService.saveCompanyData(dataList);
    return { message: 'Scraping completed' };
  }

  @ApiOperation({
    summary: '실적 정보 스크래핑',
    description: '지정된 기간 동안의 기업 실적 정보를 스크래핑합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스크래핑 성공',
    type: ScrapingResponse,
  })
  @ApiResponse({
    status: 500,
    description: '스크래핑 실패',
    type: ExceptionResponse,
  })
  @Post('earnings')
  async scrapeEarnings(
    @Body() scrapeDto: ScrapeDto,
  ): Promise<ScrapingResponse<null>> {
    const dataList = await this.scrapingService.scrapeEarnings(scrapeDto);
    await this.persistenceService.saveEarningsData(dataList);
    await this.persistenceService.updateEarningsPreviousValues();
    return { message: 'Scraping completed' };
  }

  @ApiOperation({
    summary: '배당 정보 스크래핑',
    description: '지정된 기간 동안의 기업 배당 정보를 스크래핑합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스크래핑 성공',
    type: ScrapingResponse,
  })
  @ApiResponse({
    status: 500,
    description: '스크래핑 실패',
    type: ExceptionResponse,
  })
  @Post('dividend')
  async scrapeDividend(
    @Body() scrapeDto: ScrapeDto,
  ): Promise<ScrapingResponse<null>> {
    const dataList = await this.scrapingService.scrapeDividend(scrapeDto);
    await this.persistenceService.saveDividendData(dataList);
    await this.persistenceService.updateDividendPreviousValues();
    return { message: 'Scraping completed' };
  }
}
