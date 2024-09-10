import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapeDto } from './dto/scrape.dto';
import { ScrapeCompanyDto } from './dto/country.dto';

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
    const { country } = scrapeCompanyDto;
    if (country === 'USA') {
      await this.scrapingService.scrapeUSACompany();
    } else if (country === 'KOR') {
      // await this.scrapingService.scrapeKoreaCompany();
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
