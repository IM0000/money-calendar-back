import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapeDto } from './dto/scrape.dto';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('economic-indicator')
  async scrape(@Body() scrapeDto: ScrapeDto) {
    await this.scrapingService.scrapeEconomicIndicator(scrapeDto);
    return 'Scraping completed';
  }
}
