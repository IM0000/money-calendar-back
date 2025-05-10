import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PrismaModule, PersistenceModule],
  controllers: [ScrapingController],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
