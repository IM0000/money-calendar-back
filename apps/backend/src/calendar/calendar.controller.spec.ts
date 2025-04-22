import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

describe('CalendarController', () => {
  let controller: CalendarController;
  let calendarService: CalendarService;

  const mockCalendarService = {
    getCalendarEvents: jest.fn(),
    getEarningsEvents: jest.fn(),
    getDividendEvents: jest.fn(),
    getEconomicIndicatorsEvents: jest.fn(),
    getCompanyEarningsHistory: jest.fn(),
    getCompanyDividendHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    calendarService = module.get<CalendarService>(CalendarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCalendarEvents', () => {
    it('사용자 컨텍스트 없이 주어진 시간 범위에 대한 모든 이벤트를 반환해야 합니다', async () => {
      const mockEvents = {
        earnings: [],
        dividends: [],
        economicIndicators: [],
      };
      mockCalendarService.getCalendarEvents.mockResolvedValue(mockEvents);

      const query = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const req = { user: undefined };

      const result = await controller.getCalendarEvents(query, req);

      expect(calendarService.getCalendarEvents).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        undefined,
      );
      expect(result).toEqual(mockEvents);
    });

    it('사용자 컨텍스트가 있는 경우 사용자 정보를 포함한 모든 이벤트를 반환해야 합니다', async () => {
      const mockUser = { id: 1 };
      const mockEvents = {
        earnings: [],
        dividends: [],
        economicIndicators: [],
      };
      mockCalendarService.getCalendarEvents.mockResolvedValue(mockEvents);

      const query = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const req = { user: mockUser };

      const result = await controller.getCalendarEvents(query, req);

      expect(calendarService.getCalendarEvents).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        mockUser.id,
      );
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEarningsEvents', () => {
    it('주어진 시간 범위에 대한 실적 이벤트를 반환해야 합니다', async () => {
      const mockEarnings = [];
      mockCalendarService.getEarningsEvents.mockResolvedValue(mockEarnings);

      const query = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const req = { user: undefined };

      const result = await controller.getEarningsEvents(query, req);

      expect(calendarService.getEarningsEvents).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        undefined,
      );
      expect(result).toEqual(mockEarnings);
    });
  });

  describe('getDividendEvents', () => {
    it('주어진 시간 범위에 대한 배당 이벤트를 반환해야 합니다', async () => {
      const mockDividends = [];
      mockCalendarService.getDividendEvents.mockResolvedValue(mockDividends);

      const query = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const req = { user: undefined };

      const result = await controller.getDividendEvents(query, req);

      expect(calendarService.getDividendEvents).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        undefined,
      );
      expect(result).toEqual(mockDividends);
    });
  });

  describe('getEconomicIndicatorEvents', () => {
    it('주어진 시간 범위에 대한 경제지표 이벤트를 반환해야 합니다', async () => {
      const mockIndicators = [];
      mockCalendarService.getEconomicIndicatorsEvents.mockResolvedValue(
        mockIndicators,
      );

      const query = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const req = { user: undefined };

      const result = await controller.getEconomicIndicatorEvents(query, req);

      expect(calendarService.getEconomicIndicatorsEvents).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        undefined,
      );
      expect(result).toEqual(mockIndicators);
    });
  });

  describe('getCompanyEarningsHistory', () => {
    it('특정 회사의 실적 이력을 반환해야 합니다', async () => {
      const mockHistory = { items: [], pagination: {} };
      const companyId = 1;
      const query = { page: 1, limit: 10 };
      const req = { user: undefined };

      mockCalendarService.getCompanyEarningsHistory.mockResolvedValue(
        mockHistory,
      );

      const result = await controller.getCompanyEarningsHistory(
        companyId,
        query,
        req,
      );

      expect(calendarService.getCompanyEarningsHistory).toHaveBeenCalledWith(
        companyId,
        query.page,
        query.limit,
        undefined,
      );
      expect(result).toEqual(mockHistory);
    });
  });

  describe('getCompanyDividendHistory', () => {
    it('특정 회사의 배당 이력을 반환해야 합니다', async () => {
      const mockHistory = { items: [], pagination: {} };
      const companyId = 1;
      const query = { page: 1, limit: 10 };
      const req = { user: undefined };

      mockCalendarService.getCompanyDividendHistory.mockResolvedValue(
        mockHistory,
      );

      const result = await controller.getCompanyDividendHistory(
        companyId,
        query,
        req,
      );

      expect(calendarService.getCompanyDividendHistory).toHaveBeenCalledWith(
        companyId,
        query.page,
        query.limit,
        undefined,
      );
      expect(result).toEqual(mockHistory);
    });
  });
});
