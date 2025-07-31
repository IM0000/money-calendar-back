import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { CalendarRepository } from './calendar.repository';
import { FavoriteService } from '../favorite/favorite.service';
import { ReleaseTiming } from '@prisma/client';

describe('CalendarService', () => {
  let service: CalendarService;
  let calendarRepository: CalendarRepository;
  let favoriteService: FavoriteService;

  // Mocking CalendarRepository
  const mockCalendarRepository = {
    findEarningsByDateRange: jest.fn(),
    findEarningsByCompanyIds: jest.fn(),
    findDividendsByDateRange: jest.fn(),
    findDividendsByCompanyIds: jest.fn(),
    findEconomicIndicatorsByDateRange: jest.fn(),
    findEconomicIndicatorsByGroups: jest.fn(),
    findUserFavoriteData: jest.fn(),
    findCompanyEarningsHistory: jest.fn(),
    findCompanyDividendHistory: jest.fn(),
    findIndicatorGroupHistory: jest.fn(),
    checkCompanyFavoriteAndSubscription: jest.fn(),
    checkIndicatorGroupFavoriteAndSubscription: jest.fn(),
  };

  // Mocking FavoriteService
  const mockFavoriteService = {
    getAllFavorites: jest.fn(),
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
      country: 'USA',
      company: {
        id: mockCompanyId,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        country: 'USA',
        marketValue: '2000000000000',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
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
      country: 'USA',
      company: {
        id: mockCompanyId,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        country: 'USA',
        marketValue: '2000000000000',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockEconomicIndicators = [
    {
      id: 1,
      releaseDate: BigInt(1625097600000), // 2021-07-01
      name: 'Non-Farm Payrolls',
      baseName: 'Non-Farm Payrolls',
      importance: 3, // HIGH importance as number
      actual: '850K',
      forecast: '700K',
      previous: '559K',
      country: 'USA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: CalendarRepository,
          useValue: mockCalendarRepository,
        },
        {
          provide: FavoriteService,
          useValue: mockFavoriteService,
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    calendarRepository = module.get<CalendarRepository>(CalendarRepository);
    favoriteService = module.get<FavoriteService>(FavoriteService);
  });

  it('정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('getEarningsEvents', () => {
    it('사용자 ID 없이 실적 이벤트를 조회해야 합니다', async () => {
      mockCalendarRepository.findEarningsByDateRange.mockResolvedValue(
        mockEarnings,
      );

      const result = await service.getEarningsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(calendarRepository.findEarningsByDateRange).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
      );

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
      mockCalendarRepository.findEarningsByDateRange.mockResolvedValue(
        mockEarnings,
      );
      mockCalendarRepository.findUserFavoriteData.mockResolvedValue({
        favoriteCompanyIds: [mockCompanyId],
        subscribedCompanyIds: [mockCompanyId],
        favoriteIndicatorGroups: [],
        subscribedIndicatorGroups: [],
      });

      const result = await service.getEarningsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(calendarRepository.findEarningsByDateRange).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(calendarRepository.findUserFavoriteData).toHaveBeenCalledWith(
        mockUserId,
      );

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
      mockCalendarRepository.findDividendsByDateRange.mockResolvedValue(
        mockDividends,
      );

      const result = await service.getDividendEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(calendarRepository.findDividendsByDateRange).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(result).toHaveLength(mockDividends.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockDividends[0].id,
          exDividendDate: Number(mockDividends[0].exDividendDate),
          company: expect.objectContaining({
            ticker: mockDividends[0].company.ticker,
          }),
          isFavorite: false,
          hasNotification: false,
        }),
      );
    });

    it('사용자 ID와 함께 배당 이벤트를 조회하고 관심 정보를 표시해야 합니다', async () => {
      mockCalendarRepository.findDividendsByDateRange.mockResolvedValue(
        mockDividends,
      );
      mockCalendarRepository.findUserFavoriteData.mockResolvedValue({
        favoriteCompanyIds: [mockCompanyId],
        subscribedCompanyIds: [],
        favoriteIndicatorGroups: [],
        subscribedIndicatorGroups: [],
      });

      const result = await service.getDividendEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(calendarRepository.findDividendsByDateRange).toHaveBeenCalledWith(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(calendarRepository.findUserFavoriteData).toHaveBeenCalledWith(
        mockUserId,
      );

      expect(result).toHaveLength(mockDividends.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockDividends[0].id,
          exDividendDate: Number(mockDividends[0].exDividendDate),
          company: expect.objectContaining({
            ticker: mockDividends[0].company.ticker,
          }),
          isFavorite: true,
          hasNotification: false,
        }),
      );
    });
  });

  describe('getEconomicIndicatorsEvents', () => {
    it('사용자 ID 없이 경제 지표 이벤트를 조회해야 합니다', async () => {
      mockCalendarRepository.findEconomicIndicatorsByDateRange.mockResolvedValue(
        mockEconomicIndicators,
      );

      const result = await service.getEconomicIndicatorsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(
        calendarRepository.findEconomicIndicatorsByDateRange,
      ).toHaveBeenCalledWith(mockStartTimestamp, mockEndTimestamp);

      expect(result).toHaveLength(mockEconomicIndicators.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockEconomicIndicators[0].id,
          releaseDate: Number(mockEconomicIndicators[0].releaseDate),
          isFavorite: false,
          hasNotification: false,
        }),
      );
    });

    it('사용자 ID와 함께 경제 지표 이벤트를 조회하고 관심 정보를 표시해야 합니다', async () => {
      mockCalendarRepository.findEconomicIndicatorsByDateRange.mockResolvedValue(
        mockEconomicIndicators,
      );
      mockCalendarRepository.findUserFavoriteData.mockResolvedValue({
        favoriteCompanyIds: [],
        subscribedCompanyIds: [],
        favoriteIndicatorGroups: [
          { baseName: 'Non-Farm Payrolls', country: 'USA' },
        ],
        subscribedIndicatorGroups: [
          { baseName: 'Non-Farm Payrolls', country: 'USA' },
        ],
      });

      const result = await service.getEconomicIndicatorsEvents(
        mockStartTimestamp,
        mockEndTimestamp,
        mockUserId,
      );

      expect(
        calendarRepository.findEconomicIndicatorsByDateRange,
      ).toHaveBeenCalledWith(mockStartTimestamp, mockEndTimestamp);

      expect(calendarRepository.findUserFavoriteData).toHaveBeenCalledWith(
        mockUserId,
      );

      expect(result).toHaveLength(mockEconomicIndicators.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockEconomicIndicators[0].id,
          releaseDate: Number(mockEconomicIndicators[0].releaseDate),
          isFavorite: true,
          hasNotification: true,
        }),
      );
    });
  });

  describe('getFavoriteCalendarEvents', () => {
    it('사용자의 관심 캘린더 이벤트를 조회해야 합니다', async () => {
      const mockFavorites = {
        companies: [{ companyId: mockCompanyId }],
        indicatorGroups: [{ baseName: 'Non-Farm Payrolls', country: 'USA' }],
      };

      mockFavoriteService.getAllFavorites.mockResolvedValue(mockFavorites);
      mockCalendarRepository.findEarningsByCompanyIds.mockResolvedValue(
        mockEarnings,
      );
      mockCalendarRepository.findDividendsByCompanyIds.mockResolvedValue(
        mockDividends,
      );
      mockCalendarRepository.findEconomicIndicatorsByGroups.mockResolvedValue(
        mockEconomicIndicators,
      );
      mockCalendarRepository.findUserFavoriteData.mockResolvedValue({
        favoriteCompanyIds: [mockCompanyId],
        subscribedCompanyIds: [mockCompanyId],
        favoriteIndicatorGroups: [
          { baseName: 'Non-Farm Payrolls', country: 'USA' },
        ],
        subscribedIndicatorGroups: [
          { baseName: 'Non-Farm Payrolls', country: 'USA' },
        ],
      });

      const result = await service.getFavoriteCalendarEvents(
        mockUserId,
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(favoriteService.getAllFavorites).toHaveBeenCalledWith(mockUserId);
      expect(calendarRepository.findEarningsByCompanyIds).toHaveBeenCalledWith(
        [mockCompanyId],
        mockStartTimestamp,
        mockEndTimestamp,
      );
      expect(calendarRepository.findDividendsByCompanyIds).toHaveBeenCalledWith(
        [mockCompanyId],
        mockStartTimestamp,
        mockEndTimestamp,
      );
      expect(
        calendarRepository.findEconomicIndicatorsByGroups,
      ).toHaveBeenCalledWith(
        [{ baseName: 'Non-Farm Payrolls', country: 'USA' }],
        mockStartTimestamp,
        mockEndTimestamp,
      );

      expect(result).toHaveProperty('earnings');
      expect(result).toHaveProperty('dividends');
      expect(result).toHaveProperty('economicIndicators');
    });
  });

  describe('getCompanyEarningsHistory', () => {
    it('회사 실적 히스토리를 조회해야 합니다', async () => {
      const mockPaginatedEarnings = {
        items: mockEarnings,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCalendarRepository.findCompanyEarningsHistory.mockResolvedValue(
        mockPaginatedEarnings,
      );
      mockCalendarRepository.checkCompanyFavoriteAndSubscription.mockResolvedValue(
        {
          isFavorite: true,
          isSubscribed: true,
        },
      );

      const result = await service.getCompanyEarningsHistory(
        mockCompanyId,
        1,
        10,
        mockUserId,
      );

      expect(
        calendarRepository.findCompanyEarningsHistory,
      ).toHaveBeenCalledWith(mockCompanyId, 1, 10);
      expect(
        calendarRepository.checkCompanyFavoriteAndSubscription,
      ).toHaveBeenCalledWith(mockUserId, mockCompanyId);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
    });
  });

  describe('getCompanyDividendHistory', () => {
    it('회사 배당 히스토리를 조회해야 합니다', async () => {
      const mockPaginatedDividends = {
        items: mockDividends,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCalendarRepository.findCompanyDividendHistory.mockResolvedValue(
        mockPaginatedDividends,
      );
      mockCalendarRepository.checkCompanyFavoriteAndSubscription.mockResolvedValue(
        {
          isFavorite: true,
          isSubscribed: true,
        },
      );

      const result = await service.getCompanyDividendHistory(
        mockCompanyId,
        1,
        10,
        mockUserId,
      );

      expect(
        calendarRepository.findCompanyDividendHistory,
      ).toHaveBeenCalledWith(mockCompanyId, 1, 10);
      expect(
        calendarRepository.checkCompanyFavoriteAndSubscription,
      ).toHaveBeenCalledWith(mockUserId, mockCompanyId);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
    });
  });

  describe('getIndicatorGroupHistory', () => {
    it('지표 그룹 히스토리를 조회해야 합니다', async () => {
      const mockPaginatedIndicators = {
        items: mockEconomicIndicators,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCalendarRepository.findIndicatorGroupHistory.mockResolvedValue(
        mockPaginatedIndicators,
      );
      mockCalendarRepository.checkIndicatorGroupFavoriteAndSubscription.mockResolvedValue(
        {
          isFavorite: true,
          isSubscribed: true,
        },
      );

      const result = await service.getIndicatorGroupHistory(
        'Non-Farm Payrolls',
        'USA',
        1,
        10,
        mockUserId,
      );

      expect(calendarRepository.findIndicatorGroupHistory).toHaveBeenCalledWith(
        'Non-Farm Payrolls',
        'USA',
        1,
        10,
      );
      expect(
        calendarRepository.checkIndicatorGroupFavoriteAndSubscription,
      ).toHaveBeenCalledWith(mockUserId, 'Non-Farm Payrolls', 'USA');

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
    });
  });
});
