import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { NaverCompanyScrapingService } from './services/naver-company-scraping.service';
import { InvestingEconomicScrapingService } from './services/investing-economic-scraping.service';
import { InvestingEarningsScrapingService } from './services/investing-earnings-scraping.service';
import { InvestingDividendScrapingService } from './services/investing-dividend-scraping.service';

@Module({
  imports: [PrismaModule, PersistenceModule],
  controllers: [ScrapingController],
  providers: [
    ScrapingService,
    NaverCompanyScrapingService,
    InvestingEconomicScrapingService,
    InvestingEarningsScrapingService,
    InvestingDividendScrapingService,
  ],
  exports: [ScrapingService],
})
export class ScrapingModule {}
