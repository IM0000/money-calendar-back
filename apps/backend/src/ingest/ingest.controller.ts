import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestJwtAuthGuard } from '../auth/jwt/ingest-jwt-auth.gurad';
import { IngestDto } from './dto/ingest.dto';
import { IngestService } from './ingest.service';

@UseGuards(IngestJwtAuthGuard)
@Controller('ingest')
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
