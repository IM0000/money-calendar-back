import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { ScrapeDto } from '../scraping/dto/scrape.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExceptionResponse } from '../common/filters/all-exceptions.filter';

@ApiTags('Ingest')
@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestionService: IngestService) {}

  @Post('economic-indicator')
  @ApiOperation({ summary: '스크래핑 → 인제스트 (경제지표)' })
  @ApiResponse({ status: 200, description: '완료' })
  @ApiResponse({ status: 500, type: ExceptionResponse })
  async ingestEconomic(@Body() dto: ScrapeDto) {
    await this.ingestionService.scrapeAndIngestEconomicIndicator(dto);
    return { message: 'Economic indicator ingested' };
  }

  @Post('dividend')
  @ApiOperation({ summary: '스크래핑 → 인제스트 (배당)' })
  async ingestDividend(@Body() dto: ScrapeDto) {
    await this.ingestionService.scrapeAndIngestDividend(dto);
    return { message: 'Dividend ingested' };
  }

  @Post('earnings')
  @ApiOperation({ summary: '스크래핑 → 인제스트 (실적)' })
  async ingestEarnings(@Body() dto: ScrapeDto) {
    await this.ingestionService.scrapeAndIngestEarnings(dto);
    return { message: 'Earnings ingested' };
  }

  @Post('company')
  @ApiOperation({ summary: '스크래핑 → 인제스트 (기업 정보)' })
  async ingestCompany() {
    await this.ingestionService.scrapeAndIngestCompany();
    return { message: 'Company data ingested' };
  }
}
