import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';

describe('ScrapingController', () => {
  let scrapingController: ScrapingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScrapingController],
      providers: [ScrapingService],
    }).compile();

    scrapingController = app.get<ScrapingController>(ScrapingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(scrapingController.getHello()).toBe('Hello World!');
    });
  });
});
