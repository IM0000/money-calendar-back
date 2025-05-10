import { Module } from '@nestjs/common';
import { ScrapingModule } from '../scraping/scraping.module';
import { TransportModule } from '../transport/transport.module';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

@Module({
  imports: [ScrapingModule, TransportModule],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
