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

  // 목 Prisma 서비스 (새로운 스키마에 맞게 수정)
  const mockPrismaService = {
    company: {
      count: jest.fn(),
    },
    economicIndicator: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    favoriteCompany: {
      findMany: jest.fn(),
    },
    subscriptionCompany: {
      findMany: jest.fn(),
    },
    favoriteIndicatorGroup: {
      findMany: jest.fn(),
    },
    subscriptionIndicatorGroup: {
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
    mockPrismaService.favoriteCompany.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.subscriptionCompany.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.economicIndicator.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.economicIndicator.count = jest.fn().mockResolvedValue(0);
    mockPrismaService.economicIndicator.groupBy = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.favoriteIndicatorGroup.findMany = jest
      .fn()
      .mockResolvedValue([]);
    mockPrismaService.subscriptionIndicatorGroup.findMany = jest
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

    it('로그인한 사용자의 회사 단위 즐겨찾기 및 구독 정보를 포함한 기업 목록을 반환해야 합니다', async () => {
      const searchDto: SearchCompanyDto = {};
      const userId = 1;
      const mockTotal = mockCompanies.length;

      // 회사 단위 즐겨찾기 및 구독 목 데이터
      const mockFavoriteCompanies = [{ companyId: 1 }];
      const mockSubscriptionCompanies = [{ companyId: 2 }];

      mockPrismaService.$queryRaw.mockResolvedValue(mockCompanies);
      mockPrismaService.company.count.mockResolvedValue(mockTotal);
      mockPrismaService.favoriteCompany.findMany.mockResolvedValue(
        mockFavoriteCompanies,
      );
      mockPrismaService.subscriptionCompany.findMany.mockResolvedValue(
        mockSubscriptionCompanies,
      );

      const result = await service.searchCompanies(searchDto, userId);

      expect(mockPrismaService.favoriteCompany.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          companyId: { in: mockCompanies.map((c) => c.id) },
          isActive: true,
        },
        select: { companyId: true },
      });

      expect(
        mockPrismaService.subscriptionCompany.findMany,
      ).toHaveBeenCalledWith({
        where: {
          userId,
          companyId: { in: mockCompanies.map((c) => c.id) },
          isActive: true,
        },
        select: { companyId: true },
      });

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

      mockPrismaService.economicIndicator.groupBy
        .mockResolvedValueOnce(mockGroupsWithCount)
        .mockResolvedValueOnce(mockTotalGroups);

      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockEconomicIndicators,
      );

      const result = await service.searchIndicators(searchDto);

      expect(mockPrismaService.economicIndicator.groupBy).toHaveBeenCalledWith({
        by: ['baseName', 'country'],
        where: {},
        orderBy: [{ baseName: 'asc' }, { country: 'asc' }],
        skip: 0,
        take: 10,
      });

      expect(mockPrismaService.economicIndicator.groupBy).toHaveBeenCalledWith({
        by: ['baseName', 'country'],
        where: {},
      });

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

      mockPrismaService.economicIndicator.groupBy
        .mockResolvedValueOnce(mockGroupsWithCount)
        .mockResolvedValueOnce(mockTotalGroups);

      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        filteredIndicators,
      );

      const result = await service.searchIndicators(searchDto);

      expect(mockPrismaService.economicIndicator.groupBy).toHaveBeenCalledWith({
        by: ['baseName', 'country'],
        where: {
          name: {
            contains: searchDto.query,
            mode: Prisma.QueryMode.insensitive,
          },
          country: searchDto.country,
        },
        orderBy: [{ baseName: 'asc' }, { country: 'asc' }],
        skip: 0,
        take: searchDto.limit,
      });

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

      mockPrismaService.economicIndicator.groupBy
        .mockResolvedValueOnce(mockGroupsWithCount)
        .mockResolvedValueOnce(mockTotalGroups);

      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockEconomicIndicators,
      );
      mockPrismaService.favoriteIndicatorGroup.findMany.mockResolvedValue(
        mockFavoriteIndicatorGroups,
      );
      mockPrismaService.subscriptionIndicatorGroup.findMany.mockResolvedValue(
        mockSubscriptionIndicatorGroups,
      );

      const result = await service.searchIndicators(searchDto, userId);

      expect(
        mockPrismaService.favoriteIndicatorGroup.findMany,
      ).toHaveBeenCalledWith({
        where: { userId, isActive: true },
        select: { baseName: true, country: true },
      });

      expect(
        mockPrismaService.subscriptionIndicatorGroup.findMany,
      ).toHaveBeenCalledWith({
        where: { userId, isActive: true },
        select: { baseName: true, country: true },
      });

      expect(result.items[0].isFavorite).toBe(true);
      expect(result.items[0].hasNotification).toBe(false);
      expect(result.items[1].isFavorite).toBe(false);
      expect(result.items[1].hasNotification).toBe(true);
    });
  });
});
