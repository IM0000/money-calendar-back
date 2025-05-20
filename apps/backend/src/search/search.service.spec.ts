import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { Prisma } from '@prisma/client';

describe('SearchService', () => {
  let service: SearchService;
  let prismaService: PrismaService;

  // 목 데이터 정의
  const mockCompanies = [
    {
      id: 1,
      name: 'Apple Inc.',
      ticker: 'AAPL',
      country: 'US',
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
      country: 'KR',
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
      country: 'US',
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
      country: 'US',
      releaseDate: BigInt(1625097600000),
      importance: 3,
      actual: '5.4%',
      forecast: '4.9%',
      previous: '5.0%',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 목 Prisma 서비스
  const mockPrismaService = {
    company: {
      count: jest.fn(),
    },
    economicIndicator: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    favoriteEarnings: {
      findMany: jest.fn(),
    },
    favoriteDividends: {
      findMany: jest.fn(),
    },
    favoriteIndicator: {
      findMany: jest.fn(),
    },
    indicatorNotification: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn().mockResolvedValue(mockCompanies),
    $queryRawUnsafe: jest.fn().mockResolvedValue(mockCompanies),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    // 각 메서드를 jest.fn()으로 재할당
    mockPrismaService.$queryRaw = jest.fn().mockResolvedValue(mockCompanies);
    mockPrismaService.company.count = jest
      .fn()
      .mockResolvedValue(mockCompanies.length);
    mockPrismaService.favoriteEarnings.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.favoriteDividends.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.economicIndicator.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.economicIndicator.count = jest.fn().mockResolvedValue(0);
    mockPrismaService.favoriteIndicator.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.indicatorNotification.findMany = jest
      .fn()
      .mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('searchCompanies', () => {
    it('쿼리 없이 기업 목록을 검색해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {};
      const mockTotal = mockCompanies.length;

      mockPrismaService.$queryRaw.mockResolvedValue(mockCompanies);
      mockPrismaService.company.count.mockResolvedValue(mockTotal);

      const result = await service.searchCompanies(searchDto);

      const called =
        mockPrismaService.$queryRaw.mock.calls.length > 0 ||
        mockPrismaService.$queryRawUnsafe.mock.calls.length > 0;
      expect(called).toBe(true);
      expect(mockPrismaService.company.count).toHaveBeenCalled();

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
          isFavoriteEarnings: false,
          isFavoriteDividend: false,
        }),
      );
    });

    it('쿼리와 페이지네이션으로 기업을 검색해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {
        query: 'Apple',
        country: 'US',
        page: 1,
        limit: 5,
      };
      const mockTotal = 1;

      const filteredCompanies = mockCompanies.filter(
        (c) =>
          c.name.includes(searchDto.query) ||
          c.ticker.includes(searchDto.query),
      );

      mockPrismaService.$queryRaw.mockResolvedValue(filteredCompanies);
      mockPrismaService.company.count.mockResolvedValue(mockTotal);

      const result = await service.searchCompanies(searchDto);

      const called =
        mockPrismaService.$queryRaw.mock.calls.length > 0 ||
        mockPrismaService.$queryRawUnsafe.mock.calls.length > 0;
      expect(called).toBe(true);

      // WHERE 조건이 올바르게 생성되었는지 확인
      const queryRawCall =
        mockPrismaService.$queryRaw.mock.calls[0] ||
        mockPrismaService.$queryRawUnsafe.mock.calls[0];
      let queryStr = '';
      if (Array.isArray(queryRawCall[0])) {
        queryStr = queryRawCall[0].join('');
      } else {
        queryStr = String(queryRawCall[0]);
      }
      expect(queryStr).toContain('SELECT *');
      expect(queryStr).toContain('ORDER BY');
      expect(queryStr).toContain('LIMIT');
      expect(queryStr).toContain('OFFSET');

      expect(mockPrismaService.company.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: expect.any(Array),
          country: searchDto.country,
        }),
      });

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

    it('로그인한 사용자의 관심 정보를 포함한 기업 목록을 반환해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {};
      const userId = 1;
      const mockTotal = mockCompanies.length;

      // 관심 목록 목 데이터
      const mockFavoriteEarnings = [{ earnings: { companyId: 1 } }];
      const mockFavoriteDividends = [{ dividend: { companyId: 2 } }];

      mockPrismaService.$queryRaw.mockResolvedValue(mockCompanies);
      mockPrismaService.company.count.mockResolvedValue(mockTotal);
      mockPrismaService.favoriteEarnings.findMany.mockResolvedValue(
        mockFavoriteEarnings,
      );
      mockPrismaService.favoriteDividends.findMany.mockResolvedValue(
        mockFavoriteDividends,
      );

      const result = await service.searchCompanies(searchDto, userId);

      expect(mockPrismaService.favoriteEarnings.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { earnings: true },
      });

      expect(mockPrismaService.favoriteDividends.findMany).toHaveBeenCalledWith(
        {
          where: { userId },
          include: { dividend: true },
        },
      );

      expect(result.items[0].isFavoriteEarnings).toBe(true);
      expect(result.items[0].isFavoriteDividend).toBe(false);
      expect(result.items[1].isFavoriteEarnings).toBe(false);
      expect(result.items[1].isFavoriteDividend).toBe(true);
    });
  });

  describe('searchIndicators', () => {
    it('쿼리 없이 경제지표 목록을 검색해야 합니다', async () => {
      const searchDto: SearchIndicatorDto = {};
      const mockTotal = mockEconomicIndicators.length;

      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockEconomicIndicators,
      );
      mockPrismaService.economicIndicator.count.mockResolvedValue(mockTotal);

      const result = await service.searchIndicators(searchDto);

      expect(mockPrismaService.economicIndicator.findMany).toHaveBeenCalledWith(
        {
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ releaseDate: 'desc' }, { name: 'asc' }],
          distinct: ['name', 'country', 'releaseDate'],
        },
      );

      expect(mockPrismaService.economicIndicator.count).toHaveBeenCalledWith({
        where: {},
      });

      expect(result).toEqual({
        items: expect.any(Array),
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(mockTotal / 10),
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
        country: 'US',
        page: 1,
        limit: 5,
      };
      const mockTotal = 1;

      const filteredIndicators = mockEconomicIndicators.filter(
        (i) =>
          i.name.includes(searchDto.query) && i.country === searchDto.country,
      );

      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        filteredIndicators,
      );
      mockPrismaService.economicIndicator.count.mockResolvedValue(mockTotal);

      const result = await service.searchIndicators(searchDto);

      expect(mockPrismaService.economicIndicator.findMany).toHaveBeenCalledWith(
        {
          where: {
            name: {
              contains: searchDto.query,
              mode: Prisma.QueryMode.insensitive,
            },
            country: searchDto.country,
          },
          skip: 0,
          take: searchDto.limit,
          orderBy: [{ releaseDate: 'desc' }, { name: 'asc' }],
          distinct: ['name', 'country', 'releaseDate'],
        },
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

    it('로그인한 사용자의 관심 정보를 포함한 경제지표 목록을 반환해야 합니다', async () => {
      const searchDto: SearchIndicatorDto = {};
      const userId = 1;
      const mockTotal = mockEconomicIndicators.length;

      // 관심 목록 및 알림 목 데이터
      const mockFavoriteIndicators = [{ indicatorId: 1 }];
      const mockIndicatorNotifications = [{ indicatorId: 2 }];

      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockEconomicIndicators,
      );
      mockPrismaService.economicIndicator.count.mockResolvedValue(mockTotal);
      mockPrismaService.favoriteIndicator.findMany.mockResolvedValue(
        mockFavoriteIndicators,
      );
      mockPrismaService.indicatorNotification.findMany.mockResolvedValue(
        mockIndicatorNotifications,
      );

      const result = await service.searchIndicators(searchDto, userId);

      expect(mockPrismaService.favoriteIndicator.findMany).toHaveBeenCalledWith(
        {
          where: { userId },
        },
      );

      expect(
        mockPrismaService.indicatorNotification.findMany,
      ).toHaveBeenCalledWith({
        where: { userId },
      });

      expect(result.items[0].isFavorite).toBe(true);
      expect(result.items[0].hasNotification).toBe(false);
      expect(result.items[1].isFavorite).toBe(false);
      expect(result.items[1].hasNotification).toBe(true);
    });
  });
});
