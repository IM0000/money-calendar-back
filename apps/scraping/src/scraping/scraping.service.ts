import { Injectable, Logger } from '@nestjs/common';
import { ProxyConfigDto, ScrapeDto } from './dto/scrape.dto';
import { NaverCompanyScrapingService } from './services/naver-company-scraping.service';
import { InvestingEconomicScrapingService } from './services/investing-economic-scraping.service';
import { InvestingEarningsScrapingService } from './services/investing-earnings-scraping.service';
import { InvestingDividendScrapingService } from './services/investing-dividend-scraping.service';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    private readonly naverCompanyScrapingService: NaverCompanyScrapingService,
    private readonly investingEconomicScrapingService: InvestingEconomicScrapingService,
    private readonly investingEarningsScrapingService: InvestingEarningsScrapingService,
    private readonly investingDividendScrapingService: InvestingDividendScrapingService,
  ) {}

  async scrapeUSACompany(proxyConfig?: ProxyConfigDto): Promise<any[]> {
    this.logger.debug(
      'Delegating USA company scraping to NaverCompanyScrapingService',
    );
    return this.naverCompanyScrapingService.scrape(proxyConfig);
  }

  async scrapeEconomicIndicator(scrapeDto: ScrapeDto): Promise<any[]> {
    this.logger.debug(
      'Delegating economic indicator scraping to InvestingEconomicScrapingService',
    );
    return this.investingEconomicScrapingService.scrape(scrapeDto);
  }

  async scrapeEarnings(scrapeDto: ScrapeDto): Promise<any[]> {
    this.logger.debug(
      'Delegating earnings scraping to InvestingEarningsScrapingService',
    );
    return this.investingEarningsScrapingService.scrape(scrapeDto);
  }

  async scrapeDividend(scrapeDto: ScrapeDto): Promise<any[]> {
    this.logger.debug(
      'Delegating dividend scraping to InvestingDividendScrapingService',
    );
    return this.investingDividendScrapingService.scrape(scrapeDto);
  }
}
