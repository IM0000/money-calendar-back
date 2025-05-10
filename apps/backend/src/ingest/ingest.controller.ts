import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestJwtAuthGuard } from '../auth/guard/ingest-auth.gurad';
import { IngestDto } from './dto/ingest.dto';
import { IngestService } from './ingest.service';

@Controller('ingestion')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @UseGuards(IngestJwtAuthGuard)
  @Post('scraped-data')
  @HttpCode(HttpStatus.OK)
  async receiveScrapedData(
    @Body() ingestDto: IngestDto,
  ): Promise<{ message: string }> {
    await this.ingestService.handleScrapedData(ingestDto);
    return { message: 'Scraped data received successfully' };
  }
}
