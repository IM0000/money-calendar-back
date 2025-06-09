import { Module } from '@nestjs/common';
import { ScrapingModule } from '../scraping/scraping.module';
import { TransportModule } from '../transport/transport.module';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [ScrapingModule, TransportModule, PersistenceModule],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
