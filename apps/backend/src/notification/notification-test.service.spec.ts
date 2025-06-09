import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTestService } from './notification-test.service';
import { PrismaService } from '../prisma/prisma.service';
import { DividendNotificationScheduler } from './dividend-notification.scheduler';
import { NotFoundException } from '@nestjs/common';

describe('NotificationTestService', () => {
  let service: NotificationTestService;
  let prismaService: PrismaService;
  let dividendScheduler: DividendNotificationScheduler;

  const mockPrismaService = {
    economicIndicator: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    earnings: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    dividend: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockDividendScheduler = {
    testDividendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationTestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: DividendNotificationScheduler,
          useValue: mockDividendScheduler,
        },
      ],
    }).compile();

    service = module.get<NotificationTestService>(NotificationTestService);
    prismaService = module.get<PrismaService>(PrismaService);
    dividendScheduler = module.get<DividendNotificationScheduler>(
      DividendNotificationScheduler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('testIndicatorActual', () => {
    it('타임스탬프와 함께 지표 실제 값을 업데이트해야 합니다', async () => {
      const mockIndicator = {
        id: 1,
        name: 'Test Indicator',
        actual: '',
      };

      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
        mockIndicator,
      );
      mockPrismaService.economicIndicator.update.mockResolvedValue(
        mockIndicator,
      );

      const result = await service.testIndicatorActual(1);

      expect(
        mockPrismaService.economicIndicator.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.economicIndicator.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          actual: expect.any(String),
        },
      });
      expect(result).toEqual({ success: true });
    });

    it('지표를 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(null);

      await expect(service.testIndicatorActual(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restoreIndicatorActual', () => {
    it('지표 실제 값을 빈 문자열로 복원해야 합니다', async () => {
      const mockIndicator = {
        id: 1,
        name: 'Test Indicator',
        actual: '1623456789000',
      };

      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
        mockIndicator,
      );
      mockPrismaService.economicIndicator.update.mockResolvedValue(
        mockIndicator,
      );

      const result = await service.restoreIndicatorActual(1);

      expect(mockPrismaService.economicIndicator.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actual: '' },
      });
      expect(result).toEqual({ success: true });
    });

    it('지표를 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(null);

      await expect(service.restoreIndicatorActual(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('testEarningsActual', () => {
    it('타임스탬프와 함께 실적 actualEPS를 업데이트해야 합니다', async () => {
      const mockEarnings = {
        id: 1,
        actualEPS: '--',
      };

      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.earnings.update.mockResolvedValue(mockEarnings);

      const result = await service.testEarningsActual(1);

      expect(mockPrismaService.earnings.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.earnings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          actualEPS: expect.any(String),
        },
      });
      expect(result).toEqual({ success: true });
    });

    it('실적을 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.earnings.findUnique.mockResolvedValue(null);

      await expect(service.testEarningsActual(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restoreEarningsActual', () => {
    it('실적 actualEPS를 "--"로 복원해야 합니다', async () => {
      const mockEarnings = {
        id: 1,
        actualEPS: '1623456789000',
      };

      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.earnings.update.mockResolvedValue(mockEarnings);

      const result = await service.restoreEarningsActual(1);

      expect(mockPrismaService.earnings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actualEPS: '--' },
      });
      expect(result).toEqual({ success: true });
    });

    it('실적을 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.earnings.findUnique.mockResolvedValue(null);

      await expect(service.restoreEarningsActual(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('testDividendData', () => {
    it('배당 데이터를 테스트 값으로 업데이트해야 합니다', async () => {
      const mockDividend = {
        id: 1,
        dividendAmount: '0.5',
        dividendYield: '2.5%',
      };

      mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
      mockPrismaService.dividend.update.mockResolvedValue(mockDividend);

      const result = await service.testDividendData(1);

      expect(mockPrismaService.dividend.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.dividend.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          dividendAmount: expect.any(String),
          dividendYield: expect.any(String),
        },
      });
      expect(result).toEqual({ success: true });
    });

    it('배당을 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.dividend.findUnique.mockResolvedValue(null);

      await expect(service.testDividendData(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restoreDividendData', () => {
    it('배당 데이터를 "--"로 복원해야 합니다', async () => {
      const mockDividend = {
        id: 1,
        dividendAmount: '5.25',
        dividendYield: '3.75%',
      };

      mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
      mockPrismaService.dividend.update.mockResolvedValue(mockDividend);

      const result = await service.restoreDividendData(1);

      expect(mockPrismaService.dividend.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          dividendAmount: '--',
          dividendYield: '--',
        },
      });
      expect(result).toEqual({ success: true });
    });

    it('배당을 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.dividend.findUnique.mockResolvedValue(null);

      await expect(service.restoreDividendData(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('testDividendPayment', () => {
    it('배당 지급일 알림을 테스트해야 합니다', async () => {
      mockDividendScheduler.testDividendNotification.mockResolvedValue(
        undefined,
      );

      const result = await service.testDividendPayment();

      expect(mockDividendScheduler.testDividendNotification).toHaveBeenCalled();
      expect(result).toEqual({
        message: '배당 지급일 알림 테스트가 실행되었습니다.',
      });
    });
  });
});
