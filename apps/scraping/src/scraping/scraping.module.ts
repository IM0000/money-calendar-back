import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { NaverCompanyScrapingService } from './services/naver-company-scraping.service';
import { InvestingEconomicScrapingService } from './services/investing-economic-scraping.service';
import { InvestingEarningsScrapingService } from './services/investing-earnings-scraping.service';
import { InvestingDividendScrapingService } from './services/investing-dividend-scraping.service';
import { NaverCompanyParser } from './parsers/naver-company-parser';
import { InvestingEconomicParser } from './parsers/investing-economic-parser';
import { InvestingEarningsParser } from './parsers/investing-earnings-parser';
import { InvestingDividendParser } from './parsers/investing-dividend-parser';

@Module({
  imports: [PrismaModule, PersistenceModule],
  controllers: [ScrapingController],
  providers: [
    ScrapingService,
    NaverCompanyScrapingService,
    InvestingEconomicScrapingService,
    InvestingEarningsScrapingService,
    InvestingDividendScrapingService,
    // 파서들
    NaverCompanyParser,
    InvestingEconomicParser,
    InvestingEarningsParser,
    InvestingDividendParser,
  ],
  exports: [ScrapingService],
})
export class ScrapingModule {}
