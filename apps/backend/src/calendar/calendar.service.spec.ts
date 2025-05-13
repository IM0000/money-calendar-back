import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReleaseTiming } from '@prisma/client';

describe('CalendarService', () => {
  let service: CalendarService;
  let prismaService: PrismaService;

  // Mocking PrismaService
  const mockPrismaService = {
    earnings: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    dividend: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    economicIndicator: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    favorite: {
      findUnique: jest.fn(),
    },
  };

  // Sample data
  const mockStartTimestamp = 1609459200000; // 2021-01-01
  const mockEndTimestamp = 1640995200000; // 2022-01-01
  const mockCompanyId = 1;
  const mockUserId = 1;

  // Mock data
  const mockEarnings = [
    {
      id: 1,
      releaseDate: BigInt(1615852800000), // 2021-03-16
      releaseTiming: 'PRE_MARKET' as ReleaseTiming,
      actualEPS: '2.5',
      forecastEPS: '2.3',
      previousEPS: '2.1',
      actualRevenue: '1000000',
      forecastRevenue: '950000',
      previousRevenue: '900000',
      companyId: mockCompanyId,
      country: 'US',
      company: {
        id: mockCompanyId,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        country: 'US',
        marketValue: '2000000000000',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: [{ userId: mockUserId }], // 관심 목록에 추가됨
      notifications: [{ userId: mockUserId }], // 알림 설정됨
    },
  ];

  const mockDividends = [
    {
      id: 1,
      exDividendDate: BigInt(1620777600000), // 2021-05-12
      dividendAmount: '0.22',
      previousDividendAmount: '0.20',
      paymentDate: BigInt(1622592000000), // 2021-06-02
      dividendYield: '0.65',
      companyId: mockCompanyId,
      country: 'US',
      company: {
        id: mockCompanyId,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        country: 'US',
        marketValue: '2000000000000',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: [{ userId: mockUserId }], // 관심 목록에 추가됨
    },
  ];

  const mockEconomicIndicators = [
    {
      id: 1,
      releaseDate: BigInt(1625097600000), // 2021-07-01
      name: 'Non-Farm Payrolls',
      importance: 3, // HIGH importance as number
      actual: '850K',
      forecast: '700K',
      previous: '559K',
      country: 'US',
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: [{ userId: mockUserId }], // 관심 목록에 추가됨
      notifications: [{ userId: mockUserId }], // 알림 설정됨
    },
  ];

  // 서비스 메소드에서 반환되는 형식과 일치하는 변환된 이벤트
  const transformedEarnings = mockEarnings.map((e) => ({
    ...e,
    releaseDate: Number(e.releaseDate),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    isFavorite: false,
    hasNotification: false,
  }));

  const transformedDividends = mockDividends.map((d) => ({
    ...d,
    exDividendDate: Number(d.exDividendDate),
    paymentDate: Number(d.paymentDate),
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    isFavorite: false,
    hasNotification: false,
  }));

  const transformedEconomicIndicators = mockEconomicIndicators.map((i) => ({
    ...i,
    releaseDate: Number(i.releaseDate),
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
    isFavorite: false,
    hasNotification: false,
  }));

  // 사용자 관심 정보가 포함된 변환된 이벤트
  const transformedEarningsWithFavorites = mockEarnings.map((e) => ({
    ...e,
    releaseDate: Number(e.releaseDate),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    isFavorite: true,
    hasNotification: true,
  }));

  const transformedDividendsWithFavorites = mockDividends.map((d) => ({
    ...d,
    exDividendDate: Number(d.exDividendDate),
    paymentDate: Number(d.paymentDate),
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    isFavorite: true,
    hasNotification: false,
  }));

  const transformedEconomicIndicatorsWithFavorites = mockEconomicIndicators.map(
    (i) => ({
      ...i,
      releaseDate: Number(i.releaseDate),
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
      isFavorite: true,
      hasNotification: true,
    }),
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEarningsEvents', () => {
    it('사용자 ID 없이 실적 이벤트를 조회해야 합니다', async () => {
      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarnings);

      const result = await service.getEarningsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(prismaService.earnings.findMany).toHaveBeenCalledWith({
        where: {
          releaseDate: {
            gte: mockStartTimestamp,
            lte: mockEndTimestamp,
          },
        },
        include: {
          company: true,
          favorites: false,
          notifications: false,
        },
        orderBy: {
          releaseDate: 'asc',
        },
      });

      expect(result).toHaveLength(mockEarnings.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockEarnings[0].id,
          releaseDate: Number(mockEarnings[0].releaseDate),
          company: expect.objectContaining({
            ticker: mockEarnings[0].company.ticker,
          }),
          isFavorite: false,
          hasNotification: false,
        }),
      );
    });

    it('사용자 ID와 함께 실적 이벤트를 조회하고 관심 정보를 표시해야 합니다', async () => {
      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarnings);

      const result = await service.getEarningsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(prismaService.earnings.findMany).toHaveBeenCalledWith({
        where: {
          releaseDate: {
            gte: mockStartTimestamp,
            lte: mockEndTimestamp,
          },
        },
        include: {
          company: true,
          favorites: {
            where: {
              userId: mockUserId,
            },
          },
          notifications: {
            where: {
              userId: mockUserId,
            },
          },
        },
        orderBy: {
          releaseDate: 'asc',
        },
      });

      expect(result).toHaveLength(mockEarnings.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockEarnings[0].id,
          releaseDate: Number(mockEarnings[0].releaseDate),
          company: expect.objectContaining({
            ticker: mockEarnings[0].company.ticker,
          }),
          isFavorite: true,
          hasNotification: true,
        }),
      );
    });
  });

  describe('getDividendEvents', () => {
    it('사용자 ID 없이 배당 이벤트를 조회해야 합니다', async () => {
      mockPrismaService.dividend.findMany.mockResolvedValue(mockDividends);

      const result = await service.getDividendEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(prismaService.dividend.findMany).toHaveBeenCalledWith({
        where: {
          exDividendDate: {
            gte: mockStartTimestamp,
            lte: mockEndTimestamp,
          },
        },
        include: {
          company: true,
          favorites: false,
        },
        orderBy: {
          exDividendDate: 'asc',
        },
      });

      expect(result).toHaveLength(mockDividends.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockDividends[0].id,
          exDividendDate: Number(mockDividends[0].exDividendDate),
          paymentDate: Number(mockDividends[0].paymentDate),
          company: expect.objectContaining({
            ticker: mockDividends[0].company.ticker,
          }),
          isFavorite: false,
        }),
      );
    });

    it('사용자 ID와 함께 배당 이벤트를 조회하고 관심 정보를 표시해야 합니다', async () => {
      mockPrismaService.dividend.findMany.mockResolvedValue(mockDividends);

      const result = await service.getDividendEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(prismaService.dividend.findMany).toHaveBeenCalledWith({
        where: {
          exDividendDate: {
            gte: mockStartTimestamp,
            lte: mockEndTimestamp,
          },
        },
        include: {
          company: true,
          favorites: {
            where: {
              userId: mockUserId,
            },
          },
        },
        orderBy: {
          exDividendDate: 'asc',
        },
      });

      expect(result).toHaveLength(mockDividends.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockDividends[0].id,
          exDividendDate: Number(mockDividends[0].exDividendDate),
          paymentDate: Number(mockDividends[0].paymentDate),
          company: expect.objectContaining({
            ticker: mockDividends[0].company.ticker,
          }),
          isFavorite: true,
        }),
      );
    });
  });

  describe('getEconomicIndicatorsEvents', () => {
    it('사용자 ID 없이 경제지표 이벤트를 조회해야 합니다', async () => {
      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockEconomicIndicators,
      );

      const result = await service.getEconomicIndicatorsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(prismaService.economicIndicator.findMany).toHaveBeenCalledWith({
        where: {
          releaseDate: {
            gte: mockStartTimestamp,
            lte: mockEndTimestamp,
          },
        },
        include: {
          favorites: false,
          notifications: false,
        },
        orderBy: {
          releaseDate: 'asc',
        },
      });

      expect(result).toHaveLength(mockEconomicIndicators.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockEconomicIndicators[0].id,
          releaseDate: Number(mockEconomicIndicators[0].releaseDate),
          name: mockEconomicIndicators[0].name,
          importance: mockEconomicIndicators[0].importance,
          isFavorite: false,
          hasNotification: false,
        }),
      );
    });

    it('사용자 ID와 함께 경제지표 이벤트를 조회하고 관심 정보를 표시해야 합니다', async () => {
      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockEconomicIndicators,
      );

      const result = await service.getEconomicIndicatorsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(prismaService.economicIndicator.findMany).toHaveBeenCalledWith({
        where: {
          releaseDate: {
            gte: mockStartTimestamp,
            lte: mockEndTimestamp,
          },
        },
        include: {
          favorites: {
            where: {
              userId: mockUserId,
            },
          },
          notifications: {
            where: {
              userId: mockUserId,
            },
          },
        },
        orderBy: {
          releaseDate: 'asc',
        },
      });

      expect(result).toHaveLength(mockEconomicIndicators.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockEconomicIndicators[0].id,
          releaseDate: Number(mockEconomicIndicators[0].releaseDate),
          name: mockEconomicIndicators[0].name,
          importance: mockEconomicIndicators[0].importance,
          isFavorite: true,
          hasNotification: true,
        }),
      );
    });
  });

  describe('getCalendarEvents', () => {
    it('모든 유형의 이벤트(실적, 배당, 경제지표)를 조회해야 합니다', async () => {
      // 각 서비스 메서드 모킹
      jest
        .spyOn(service, 'getEarningsEvents')
        .mockResolvedValue(transformedEarnings);
      jest
        .spyOn(service, 'getDividendEvents')
        .mockResolvedValue(transformedDividends);
      jest
        .spyOn(service, 'getEconomicIndicatorsEvents')
        .mockResolvedValue(transformedEconomicIndicators);

      const result = await service.getCalendarEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(service.getEarningsEvents).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
        undefined,
      );

      expect(service.getDividendEvents).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
        undefined,
      );

      expect(service.getEconomicIndicatorsEvents).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
        undefined,
      );

      expect(result).toEqual({
        earnings: expect.any(Array),
        dividends: expect.any(Array),
        economicIndicators: expect.any(Array),
      });
    });

    it('사용자 ID와 함께 모든 유형의 이벤트를 조회해야 합니다', async () => {
      // 각 서비스 메서드 모킹
      jest
        .spyOn(service, 'getEarningsEvents')
        .mockResolvedValue(transformedEarningsWithFavorites);
      jest
        .spyOn(service, 'getDividendEvents')
        .mockResolvedValue(transformedDividendsWithFavorites);
      jest
        .spyOn(service, 'getEconomicIndicatorsEvents')
        .mockResolvedValue(transformedEconomicIndicatorsWithFavorites);

      const result = await service.getCalendarEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(service.getEarningsEvents).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(service.getDividendEvents).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(service.getEconomicIndicatorsEvents).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(result).toEqual({
        earnings: expect.any(Array),
        dividends: expect.any(Array),
        economicIndicators: expect.any(Array),
      });
    });
  });

  describe('getCompanyEarningsHistory', () => {
    it('회사의 과거 실적 발표 기록을 반환해야 합니다', async () => {
      const companyId = 1;
      const page = 1;
      const limit = 10;
      const userId = 1;

      const mockEarningsHistory = [
        {
          id: 1,
          releaseDate: 1673740800000, // 2023-01-15
          releaseTiming: 'BMO',
          actualEPS: 1.5,
          forecastEPS: 1.4,
          previousEPS: 1.3,
          actualRevenue: 10000000,
          forecastRevenue: 9000000,
          previousRevenue: 8000000,
          country: 'USA',
          company: {
            id: 101,
            name: 'Company A',
            ticker: 'CMPA',
            country: 'USA',
            marketValue: 1000000000,
          },
          favorites: [],
          notifications: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.earnings.findMany.mockResolvedValue(
        mockEarningsHistory,
      );
      mockPrismaService.earnings.count.mockResolvedValue(1);

      const result = await service.getCompanyEarningsHistory(
        companyId,
        page,
        limit,
        userId,
      );

      expect(mockPrismaService.earnings.findMany).toHaveBeenCalledWith({
        where: {
          companyId,
        },
        include: {
          company: true,
          favorites: {
            where: {
              userId,
            },
          },
          notifications: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          releaseDate: 'desc',
        },
        skip: 0,
        take: limit,
      });

      expect(mockPrismaService.earnings.count).toHaveBeenCalledWith({
        where: {
          companyId,
        },
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('total', 1);
      expect(result.pagination).toHaveProperty('page', 1);
      expect(result.pagination).toHaveProperty('limit', 10);
    });
  });

  describe('getCompanyDividendHistory', () => {
    it('회사의 과거 배당 발표 기록을 반환해야 합니다', async () => {
      const companyId = 1;
      const page = 1;
      const limit = 10;
      const userId = 1;

      const mockDividendHistory = [
        {
          id: 1,
          exDividendDate: 1674172800000, // 2023-01-20
          dividendAmount: 0.5,
          previousDividendAmount: 0.4,
          paymentDate: 1675123200000, // 2023-01-31
          dividendYield: 2.5,
          country: 'USA',
          company: {
            id: 101,
            name: 'Company B',
            ticker: 'CMPB',
            country: 'USA',
            marketValue: 1500000000,
          },
          favorites: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.dividend.findMany.mockResolvedValue(
        mockDividendHistory,
      );
      mockPrismaService.dividend.count.mockResolvedValue(1);

      const result = await service.getCompanyDividendHistory(
        companyId,
        page,
        limit,
        userId,
      );

      expect(mockPrismaService.dividend.findMany).toHaveBeenCalledWith({
        where: {
          companyId,
        },
        include: {
          company: true,
          favorites: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          exDividendDate: 'desc',
        },
        skip: 0,
        take: limit,
      });

      expect(mockPrismaService.dividend.count).toHaveBeenCalledWith({
        where: {
          companyId,
        },
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('total', 1);
      expect(result.pagination).toHaveProperty('page', 1);
      expect(result.pagination).toHaveProperty('limit', 10);
    });
  });
});
