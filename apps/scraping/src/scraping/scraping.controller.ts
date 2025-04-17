import { Body, Controller, Post } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapeCompanyDto, ScrapeDto } from './dto/scrape.dto';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('economic-indicator')
  async scrapeEconomicIndicator(@Body() scrapeDto: ScrapeDto) {
    await this.scrapingService.scrapeEconomicIndicator(scrapeDto);
    return 'Scraping completed';
  }

  @Post('company')
  async scrapeCompany(@Body() scrapeCompanyDto: ScrapeCompanyDto) {
    const { country, proxyConfig } = scrapeCompanyDto;

    if (country === 'USA') {
      await this.scrapingService.scrapeUSACompany(proxyConfig);
    }

    return 'Scraping completed';
  }

  @Post('earnings')
  async scrapeEarnings(@Body() scrapeDto: ScrapeDto) {
    await this.scrapingService.scrapeEarnings(scrapeDto);
    return 'Scraping completed';
  }

  @Post('dividend')
  async scrapeDividend(@Body() scrapeDto: ScrapeDto) {
    await this.scrapingService.scrapeDividend(scrapeDto);
    return 'Scraping completed';
  }
}
