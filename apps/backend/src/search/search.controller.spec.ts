import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  // 목 데이터 정의
  const mockCompanyResults = {
    items: [
      {
        id: 1,
        name: 'Apple Inc.',
        ticker: 'AAPL',
        country: 'US',
        industry: 'Technology',
        isFavoriteEarnings: false,
        isFavoriteDividend: false,
      },
      {
        id: 2,
        name: 'Samsung Electronics',
        ticker: '005930.KS',
        country: 'KR',
        industry: 'Technology',
        isFavoriteEarnings: false,
        isFavoriteDividend: false,
      },
    ],
    pagination: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  };

  const mockIndicatorResults = {
    items: [
      {
        id: 1,
        name: 'Non-Farm Payrolls',
        country: 'US',
        releaseDate: 1625097600000,
        isFavorite: false,
        hasNotification: false,
      },
      {
        id: 2,
        name: 'CPI',
        country: 'US',
        releaseDate: 1625097600000,
        isFavorite: false,
        hasNotification: false,
      },
    ],
    pagination: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  };

  // 목 서비스
  const mockSearchService = {
    searchCompanies: jest.fn(),
    searchIndicators: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  it('컨트롤러가 정의되어 있어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  describe('searchCompanies', () => {
    it('기업 검색 결과를 반환해야 합니다', async () => {
      const dto: SearchCompanyDto = { query: 'Apple', page: 1, limit: 10 };
      mockSearchService.searchCompanies.mockResolvedValue(mockCompanyResults);

      const result = await controller.searchCompanies(dto, { user: { id: 1 } });

      expect(mockSearchService.searchCompanies).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockCompanyResults);
    });

    it('인증되지 않은 사용자를 처리해야 합니다', async () => {
      const dto: SearchCompanyDto = { query: 'Apple', page: 1, limit: 10 };
      mockSearchService.searchCompanies.mockResolvedValue(mockCompanyResults);

      const result = await controller.searchCompanies(dto, {});

      expect(mockSearchService.searchCompanies).toHaveBeenCalledWith(
        dto,
        undefined,
      );
      expect(result).toEqual(mockCompanyResults);
    });

    it('유효하지 않은 페이지네이션을 처리해야 합니다', async () => {
      const dtoPlain: SearchCompanyDto = {
        query: 'Apple',
        page: -1,
        limit: -10,
      };

      // DTO로 변환하면서 유효성 검사 수행
      const dto = plainToInstance(SearchIndicatorDto, dtoPlain);
      const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: SearchIndicatorDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('서비스 오류를 처리해야 합니다', async () => {
      const dto: SearchCompanyDto = { query: 'Apple', page: 1, limit: 10 };
      const error = new Error('서비스 오류');
      mockSearchService.searchCompanies.mockRejectedValue(error);

      await expect(controller.searchCompanies(dto, {})).rejects.toThrow(Error);
    });
  });

  describe('searchIndicators', () => {
    it('경제지표 검색 결과를 반환해야 합니다', async () => {
      const dto: SearchIndicatorDto = { query: 'CPI', page: 1, limit: 10 };
      mockSearchService.searchIndicators.mockResolvedValue(
        mockIndicatorResults,
      );

      const result = await controller.searchIndicators(dto, {
        user: { id: 1 },
      });

      expect(mockSearchService.searchIndicators).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockIndicatorResults);
    });

    it('인증되지 않은 사용자를 처리해야 합니다', async () => {
      const dto: SearchIndicatorDto = { query: 'CPI', page: 1, limit: 10 };
      mockSearchService.searchIndicators.mockResolvedValue(
        mockIndicatorResults,
      );

      const result = await controller.searchIndicators(dto, {});

      expect(mockSearchService.searchIndicators).toHaveBeenCalledWith(
        dto,
        undefined,
      );
      expect(result).toEqual(mockIndicatorResults);
    });

    it('유효하지 않은 페이지네이션을 처리해야 합니다', async () => {
      const dtoPlain: SearchIndicatorDto = {
        query: 'CPI',
        page: -1,
        limit: -10,
      };

      // DTO로 변환하면서 유효성 검사 수행
      const dto = plainToInstance(SearchIndicatorDto, dtoPlain);
      const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: SearchIndicatorDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('서비스 오류를 처리해야 합니다', async () => {
      const dto: SearchIndicatorDto = { query: 'CPI', page: 1, limit: 10 };
      const error = new Error('서비스 오류');
      mockSearchService.searchIndicators.mockRejectedValue(error);

      await expect(controller.searchIndicators(dto, {})).rejects.toThrow(Error);
    });
  });
});
