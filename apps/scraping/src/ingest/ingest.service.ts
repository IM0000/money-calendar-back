import { Injectable } from '@nestjs/common';
import { ScrapingService } from '../scraping/scraping.service';
import { TransportService } from '../transport/transport.service';
import { ScrapeDto } from '../scraping/dto/scrape.dto';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class IngestService {
  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly transportService: TransportService,
    private readonly persistenceService: PersistenceService,
  ) {}

  /**
   * 지정된 소스(sourceName)에 대해 스크래핑을 수행하고,
   * 결과를 TransportService를 통해 인제스트 API로 전송합니다.
   */
  async scrapeAndIngestEconomicIndicator(dto: ScrapeDto) {
    const data = await this.scrapingService.scrapeEconomicIndicator(dto);
    await this.transportService.sendScrapedData('economic-indicator', data);
  }

  async scrapeAndIngestDividend(dto: ScrapeDto) {
    const data = await this.scrapingService.scrapeDividend(dto);
    await this.transportService.sendScrapedData('dividend', data);
  }

  async scrapeAndIngestEarnings(dto: ScrapeDto) {
    const data = await this.scrapingService.scrapeEarnings(dto);
    await this.transportService.sendScrapedData('earnings', data);
  }

  async scrapeAndIngestCompany() {
    const data = await this.scrapingService.scrapeUSACompany();
    await this.transportService.sendScrapedData('company', data);
  }

  async scrapeAndPersistEconomicIndicator(dto: ScrapeDto) {
    const data = await this.scrapingService.scrapeEconomicIndicator(dto);
    await this.persistenceService.saveEconomicIndicatorData(data);
  }

  async scrapeAndPersistDividend(dto: ScrapeDto) {
    const data = await this.scrapingService.scrapeDividend(dto);
    await this.persistenceService.saveDividendData(data);
  }

  async scrapeAndPersistEarnings(dto: ScrapeDto) {
    const data = await this.scrapingService.scrapeEarnings(dto);
    await this.persistenceService.saveEarningsData(data);
  }

  async scrapeAndPersistCompany() {
    const data = await this.scrapingService.scrapeUSACompany();
    await this.persistenceService.saveCompanyData(data);
  }
}
