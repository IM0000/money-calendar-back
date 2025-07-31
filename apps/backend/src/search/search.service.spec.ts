import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { Prisma } from '@prisma/client';

describe('SearchService', () => {
  let service: SearchService;
  let searchRepository: SearchRepository;

  // 목 데이터 정의
  const mockCompanies = [
    {
      id: 1,
      name: 'Apple Inc.',
      ticker: 'AAPL',
      country: 'USA',
      description: '애플은 혁신적인 기술 기업입니다.',
      industry: 'Technology',
      sector: 'Consumer Electronics',
      marketValue: '2000000000000',
      website: 'https://www.apple.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Samsung Electronics',
      ticker: '005930.KS',
      country: 'KOR',
      description: '삼성전자는 한국의 대표적인 전자 기업입니다.',
      industry: 'Technology',
      sector: 'Consumer Electronics',
      marketValue: '400000000000',
      website: 'https://www.samsung.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockEconomicIndicators = [
    {
      id: 1,
      name: 'Non-Farm Payrolls',
      baseName: 'Non-Farm Payrolls',
      country: 'USA',
      releaseDate: BigInt(1625097600000),
      importance: 3,
      actual: '850K',
      forecast: '700K',
      previous: '559K',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'CPI',
      baseName: 'CPI',
      country: 'USA',
      releaseDate: BigInt(1625097600000),
      importance: 3,
      actual: '5.4%',
      forecast: '4.9%',
      previous: '5.0%',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 목 SearchRepository 서비스
  const mockSearchRepository = {
    searchCompaniesRaw: jest.fn(),
    countCompanies: jest.fn(),
    findFavoriteCompanies: jest.fn(),
    findSubscriptionCompanies: jest.fn(),
    groupIndicatorsByBaseName: jest.fn(),
    countIndicatorGroups: jest.fn(),
    findIndicatorsByGroups: jest.fn(),
    findFavoriteIndicatorGroups: jest.fn(),
    findSubscriptionIndicatorGroups: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    // 각 메서드를 jest.fn()으로 재할당
    mockSearchRepository.searchCompaniesRaw = jest
      .fn()
      .mockResolvedValue(mockCompanies);
    mockSearchRepository.countCompanies = jest
      .fn()
      .mockResolvedValue(mockCompanies.length);
    mockSearchRepository.findFavoriteCompanies = jest
      .fn()
      .mockResolvedValue([]);
    mockSearchRepository.findSubscriptionCompanies = jest
      .fn()
      .mockResolvedValue([]);
    mockSearchRepository.groupIndicatorsByBaseName = jest
      .fn()
      .mockResolvedValue([]);
    mockSearchRepository.countIndicatorGroups = jest.fn().mockResolvedValue([]);
    mockSearchRepository.findIndicatorsByGroups = jest
      .fn()
      .mockResolvedValue([]);
    mockSearchRepository.findFavoriteIndicatorGroups = jest
      .fn()
      .mockResolvedValue([]);
    mockSearchRepository.findSubscriptionIndicatorGroups = jest
      .fn()
      .mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: SearchRepository,
          useValue: mockSearchRepository,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    searchRepository = module.get<SearchRepository>(SearchRepository);
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('searchCompanies', () => {
    it('쿼리 없이 기업 목록을 검색해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {};
      const mockTotal = mockCompanies.length;

      mockSearchRepository.searchCompaniesRaw.mockResolvedValue(mockCompanies);
      mockSearchRepository.countCompanies.mockResolvedValue(mockTotal);

      const result = await service.searchCompanies(searchDto);

      expect(mockSearchRepository.searchCompaniesRaw).toHaveBeenCalledWith(
        '',
        '',
        10,
        0,
      );
      expect(mockSearchRepository.countCompanies).toHaveBeenCalledWith(
        undefined,
        undefined,
      );

      expect(result).toEqual({
        items: expect.any(Array),
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(mockTotal / 10),
        },
      });

      expect(result.items.length).toBe(mockCompanies.length);
      expect(result.items[0]).toEqual(
        expect.objectContaining({
          id: mockCompanies[0].id,
          name: mockCompanies[0].name,
          ticker: mockCompanies[0].ticker,
          isFavorite: false,
        }),
      );
    });

    it('쿼리와 페이지네이션으로 기업을 검색해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {
        query: 'Apple',
        country: 'USA',
        page: 1,
        limit: 5,
      };
      const mockTotal = 1;

      const filteredCompanies = mockCompanies.filter(
        (c) =>
          c.name.includes(searchDto.query) ||
          c.ticker.includes(searchDto.query),
      );

      mockSearchRepository.searchCompaniesRaw.mockResolvedValue(
        filteredCompanies,
      );
      mockSearchRepository.countCompanies.mockResolvedValue(mockTotal);

      const result = await service.searchCompanies(searchDto);

      expect(mockSearchRepository.searchCompaniesRaw).toHaveBeenCalledWith(
        searchDto.query,
        searchDto.country,
        searchDto.limit,
        0,
      );

      expect(mockSearchRepository.countCompanies).toHaveBeenCalledWith(
        searchDto.query,
        searchDto.country,
      );

      expect(result).toEqual({
        items: expect.any(Array),
        pagination: {
          total: mockTotal,
          page: searchDto.page,
          limit: searchDto.limit,
          totalPages: Math.ceil(mockTotal / searchDto.limit),
        },
      });
    });

    it('로그인한 사용자의 회사 단위 즐겨찾기 및 구독 정보를 포함한 기업 목록을 반환해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {};
      const userId = 1;
      const mockTotal = mockCompanies.length;

      // 회사 단위 즐겨찾기 및 구독 목 데이터
      const mockFavoriteCompanies = [{ companyId: 1 }];
      const mockSubscriptionCompanies = [{ companyId: 2 }];

      mockSearchRepository.searchCompaniesRaw.mockResolvedValue(mockCompanies);
      mockSearchRepository.countCompanies.mockResolvedValue(mockTotal);
      mockSearchRepository.findFavoriteCompanies.mockResolvedValue(
        mockFavoriteCompanies,
      );
      mockSearchRepository.findSubscriptionCompanies.mockResolvedValue(
        mockSubscriptionCompanies,
      );

      const result = await service.searchCompanies(searchDto, userId);

      expect(mockSearchRepository.findFavoriteCompanies).toHaveBeenCalledWith(
        userId,
        mockCompanies.map((c) => c.id),
      );

      expect(
        mockSearchRepository.findSubscriptionCompanies,
      ).toHaveBeenCalledWith(
        userId,
        mockCompanies.map((c) => c.id),
      );

      expect(result.items[0].isFavorite).toBe(true);
      expect(result.items[0].hasSubscription).toBe(false);
      expect(result.items[1].isFavorite).toBe(false);
      expect(result.items[1].hasSubscription).toBe(true);
    });
  });

  describe('searchIndicators', () => {
    it('쿼리 없이 경제지표 목록을 검색해야 합니다', async () => {
      const searchDto: SearchIndicatorDto = {};

      const mockGroupsWithCount = [
        { baseName: 'Non-Farm Payrolls', country: 'USA' },
        { baseName: 'CPI', country: 'USA' },
      ];

      const mockTotalGroups = [
        { baseName: 'Non-Farm Payrolls', country: 'USA' },
        { baseName: 'CPI', country: 'USA' },
      ];

      mockSearchRepository.groupIndicatorsByBaseName.mockResolvedValue(
        mockGroupsWithCount,
      );
      mockSearchRepository.countIndicatorGroups.mockResolvedValue(
        mockTotalGroups,
      );

      mockSearchRepository.findIndicatorsByGroups.mockResolvedValue(
        mockEconomicIndicators,
      );

      const result = await service.searchIndicators(searchDto);

      expect(
        mockSearchRepository.groupIndicatorsByBaseName,
      ).toHaveBeenCalledWith({}, 0, 10);

      expect(mockSearchRepository.countIndicatorGroups).toHaveBeenCalledWith(
        {},
      );

      expect(result).toEqual({
        items: expect.any(Array),
        pagination: {
          total: mockTotalGroups.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(mockTotalGroups.length / 10),
        },
      });

      expect(result.items.length).toBe(mockEconomicIndicators.length);
      expect(result.items[0]).toEqual(
        expect.objectContaining({
          id: mockEconomicIndicators[0].id,
          name: mockEconomicIndicators[0].name,
          releaseDate: Number(mockEconomicIndicators[0].releaseDate),
          isFavorite: false,
          hasNotification: false,
        }),
      );
    });

    it('쿼리와 페이지네이션으로 경제지표를 검색해야 합니다', async () => {
      const searchDto: SearchIndicatorDto = {
        query: 'CPI',
        country: 'USA',
        page: 1,
        limit: 5,
      };

      const filteredIndicators = mockEconomicIndicators.filter(
        (i) =>
          i.name.includes(searchDto.query) && i.country === searchDto.country,
      );

      const mockGroupsWithCount = [{ baseName: 'CPI', country: 'USA' }];
      const mockTotalGroups = [{ baseName: 'CPI', country: 'USA' }];

      mockSearchRepository.groupIndicatorsByBaseName.mockResolvedValue(
        mockGroupsWithCount,
      );
      mockSearchRepository.countIndicatorGroups.mockResolvedValue(
        mockTotalGroups,
      );

      mockSearchRepository.findIndicatorsByGroups.mockResolvedValue(
        filteredIndicators,
      );

      const result = await service.searchIndicators(searchDto);

      expect(
        mockSearchRepository.groupIndicatorsByBaseName,
      ).toHaveBeenCalledWith(
        {
          name: {
            contains: searchDto.query,
            mode: Prisma.QueryMode.insensitive,
          },
          country: searchDto.country,
        },
        0,
        searchDto.limit,
      );

      expect(result).toEqual({
        items: expect.any(Array),
        pagination: {
          total: mockTotalGroups.length,
          page: searchDto.page,
          limit: searchDto.limit,
          totalPages: Math.ceil(mockTotalGroups.length / searchDto.limit),
        },
      });
    });

    it('로그인한 사용자의 지표 그룹 단위 즐겨찾기/구독 정보를 포함한 경제지표 목록을 반환해야 합니다', async () => {
      const searchDto: SearchIndicatorDto = {};
      const userId = 1;

      const mockGroupsWithCount = [
        { baseName: 'Non-Farm Payrolls', country: 'USA' },
        { baseName: 'CPI', country: 'USA' },
      ];

      const mockTotalGroups = [
        { baseName: 'Non-Farm Payrolls', country: 'USA' },
        { baseName: 'CPI', country: 'USA' },
      ];

      // 지표 그룹 단위 즐겨찾기/구독 목 데이터
      const mockFavoriteIndicatorGroups = [
        { baseName: 'Non-Farm Payrolls', country: 'USA' },
      ];
      const mockSubscriptionIndicatorGroups = [
        { baseName: 'CPI', country: 'USA' },
      ];

      mockSearchRepository.groupIndicatorsByBaseName.mockResolvedValue(
        mockGroupsWithCount,
      );
      mockSearchRepository.countIndicatorGroups.mockResolvedValue(
        mockTotalGroups,
      );

      mockSearchRepository.findIndicatorsByGroups.mockResolvedValue(
        mockEconomicIndicators,
      );
      mockSearchRepository.findFavoriteIndicatorGroups.mockResolvedValue(
        mockFavoriteIndicatorGroups,
      );
      mockSearchRepository.findSubscriptionIndicatorGroups.mockResolvedValue(
        mockSubscriptionIndicatorGroups,
      );

      const result = await service.searchIndicators(searchDto, userId);

      expect(
        mockSearchRepository.findFavoriteIndicatorGroups,
      ).toHaveBeenCalledWith(userId);

      expect(
        mockSearchRepository.findSubscriptionIndicatorGroups,
      ).toHaveBeenCalledWith(userId);

      expect(result.items[0].isFavorite).toBe(true);
      expect(result.items[0].hasNotification).toBe(false);
      expect(result.items[1].isFavorite).toBe(false);
      expect(result.items[1].hasNotification).toBe(true);
    });
  });
});
