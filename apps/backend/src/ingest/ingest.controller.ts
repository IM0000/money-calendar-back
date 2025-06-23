import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestJwtAuthGuard } from '../security/guards/ingest-jwt-auth.guard';
import { IngestDto } from './dto/ingest.dto';
import { IngestService } from './ingest.service';

@UseGuards(IngestJwtAuthGuard)
@Controller('/api/v1/ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('scraped-data')
  @HttpCode(HttpStatus.OK)
  async receiveScrapedData(
    @Body() ingestDto: IngestDto,
  ): Promise<{ message: string }> {
    console.log('receiveScrapedData');
    await this.ingestService.handleScrapedData(ingestDto);
    return { message: 'Scraped data received successfully' };
  }
}
