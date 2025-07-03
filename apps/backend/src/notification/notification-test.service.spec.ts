import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTestService } from './notification-test.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationScheduler } from './notification.scheduler';
import { NotFoundException } from '@nestjs/common';

describe('NotificationTestService', () => {
  let service: NotificationTestService;
  let prismaService: PrismaService;
  let dividendScheduler: NotificationScheduler;

  // 테스트 데이터 팩토리 함수들
  const createMockIndicator = (overrides = {}) => ({
    id: 1,
    name: 'Consumer Price Index',
    actual: '',
    baseName: 'CPI',
    country: 'USA',
    ...overrides,
  });

  const createMockEarnings = (overrides = {}) => ({
    id: 1,
    companyId: 1,
    ticker: 'AAPL',
    actualEPS: '--',
    actualRevenue: '--',
    ...overrides,
  });

  const createMockDividend = (overrides = {}) => ({
    id: 1,
    companyId: 1,
    dividendAmount: '--',
    dividendYield: '--',
    exDividendDate: new Date(),
    ...overrides,
  });

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
          provide: NotificationScheduler,
          useValue: mockDividendScheduler,
        },
      ],
    }).compile();

    service = module.get<NotificationTestService>(NotificationTestService);
    prismaService = module.get<PrismaService>(PrismaService);
    dividendScheduler = module.get<NotificationScheduler>(
      NotificationScheduler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('경제 지표 테스트 관련 기능', () => {
    describe('testIndicatorActual', () => {
      it('지표 ID가 존재할 때 타임스탬프로 actual 값을 업데이트해야 합니다', async () => {
        // Arrange
        const mockIndicator = createMockIndicator();
        mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
          mockIndicator,
        );
        mockPrismaService.economicIndicator.update.mockResolvedValue(
          mockIndicator,
        );

        // Act
        const result = await service.testIndicatorActual(1);

        // Assert
        expect(
          mockPrismaService.economicIndicator.findUnique,
        ).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockPrismaService.economicIndicator.update).toHaveBeenCalledWith(
          {
            where: { id: 1 },
            data: {
              actual: expect.any(String),
            },
          },
        );
        expect(result).toEqual({ success: true });
      });

      it('존재하지 않는 지표 ID로 요청 시 NotFoundException을 발생시켜야 합니다', async () => {
        // Arrange
        mockPrismaService.economicIndicator.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.testIndicatorActual(999)).rejects.toThrow(
          NotFoundException,
        );
        expect(
          mockPrismaService.economicIndicator.update,
        ).not.toHaveBeenCalled();
      });

      it('다른 지표 ID에 대해서도 올바르게 동작해야 합니다', async () => {
        // Arrange
        const mockIndicator = createMockIndicator({
          id: 5,
          name: 'GDP Growth Rate',
        });
        mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
          mockIndicator,
        );
        mockPrismaService.economicIndicator.update.mockResolvedValue(
          mockIndicator,
        );

        // Act
        const result = await service.testIndicatorActual(5);

        // Assert
        expect(
          mockPrismaService.economicIndicator.findUnique,
        ).toHaveBeenCalledWith({
          where: { id: 5 },
        });
        expect(result).toEqual({ success: true });
      });
    });

    describe('restoreIndicatorActual', () => {
      it('지표 ID가 존재할 때 actual 값을 빈 문자열로 복원해야 합니다', async () => {
        // Arrange
        const mockIndicator = createMockIndicator({ actual: '1623456789000' });
        mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
          mockIndicator,
        );
        mockPrismaService.economicIndicator.update.mockResolvedValue(
          mockIndicator,
        );

        // Act
        const result = await service.restoreIndicatorActual(1);

        // Assert
        expect(
          mockPrismaService.economicIndicator.findUnique,
        ).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockPrismaService.economicIndicator.update).toHaveBeenCalledWith(
          {
            where: { id: 1 },
            data: { actual: '' },
          },
        );
        expect(result).toEqual({ success: true });
      });

      it('존재하지 않는 지표 ID로 복원 시 NotFoundException을 발생시켜야 합니다', async () => {
        // Arrange
        mockPrismaService.economicIndicator.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.restoreIndicatorActual(999)).rejects.toThrow(
          NotFoundException,
        );
        expect(
          mockPrismaService.economicIndicator.update,
        ).not.toHaveBeenCalled();
      });

      it('이미 빈 문자열인 actual 값도 복원 처리해야 합니다', async () => {
        // Arrange
        const mockIndicator = createMockIndicator({ actual: '' });
        mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
          mockIndicator,
        );
        mockPrismaService.economicIndicator.update.mockResolvedValue(
          mockIndicator,
        );

        // Act
        const result = await service.restoreIndicatorActual(1);

        // Assert
        expect(mockPrismaService.economicIndicator.update).toHaveBeenCalledWith(
          {
            where: { id: 1 },
            data: { actual: '' },
          },
        );
        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('실적 테스트 관련 기능', () => {
    describe('testEarningsActual', () => {
      it('실적 ID가 존재할 때 타임스탬프로 actualEPS를 업데이트해야 합니다', async () => {
        // Arrange
        const mockEarnings = createMockEarnings();
        mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
        mockPrismaService.earnings.update.mockResolvedValue(mockEarnings);

        // Act
        const result = await service.testEarningsActual(1);

        // Assert
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

      it('존재하지 않는 실적 ID로 요청 시 NotFoundException을 발생시켜야 합니다', async () => {
        // Arrange
        mockPrismaService.earnings.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.testEarningsActual(999)).rejects.toThrow(
          NotFoundException,
        );
        expect(mockPrismaService.earnings.update).not.toHaveBeenCalled();
      });

      it('이미 값이 있는 actualEPS도 타임스탬프로 덮어써야 합니다', async () => {
        // Arrange
        const mockEarnings = createMockEarnings({ actualEPS: '1.25' });
        mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
        mockPrismaService.earnings.update.mockResolvedValue(mockEarnings);

        // Act
        const result = await service.testEarningsActual(1);

        // Assert
        expect(mockPrismaService.earnings.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            actualEPS: expect.any(String),
          },
        });
        expect(result).toEqual({ success: true });
      });
    });

    describe('restoreEarningsActual', () => {
      it('실적 ID가 존재할 때 actualEPS를 "--"로 복원해야 합니다', async () => {
        // Arrange
        const mockEarnings = createMockEarnings({ actualEPS: '1623456789000' });
        mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
        mockPrismaService.earnings.update.mockResolvedValue(mockEarnings);

        // Act
        const result = await service.restoreEarningsActual(1);

        // Assert
        expect(mockPrismaService.earnings.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockPrismaService.earnings.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: { actualEPS: '--' },
        });
        expect(result).toEqual({ success: true });
      });

      it('존재하지 않는 실적 ID로 복원 시 NotFoundException을 발생시켜야 합니다', async () => {
        // Arrange
        mockPrismaService.earnings.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.restoreEarningsActual(999)).rejects.toThrow(
          NotFoundException,
        );
        expect(mockPrismaService.earnings.update).not.toHaveBeenCalled();
      });

      it('이미 "--"인 actualEPS도 복원 처리해야 합니다', async () => {
        // Arrange
        const mockEarnings = createMockEarnings({ actualEPS: '--' });
        mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
        mockPrismaService.earnings.update.mockResolvedValue(mockEarnings);

        // Act
        const result = await service.restoreEarningsActual(1);

        // Assert
        expect(mockPrismaService.earnings.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: { actualEPS: '--' },
        });
        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('배당 테스트 관련 기능', () => {
    describe('testDividendData', () => {
      it('배당 ID가 존재할 때 배당 데이터를 테스트 값으로 업데이트해야 합니다', async () => {
        // Arrange
        const mockDividend = createMockDividend();
        mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
        mockPrismaService.dividend.update.mockResolvedValue(mockDividend);

        // Act
        const result = await service.testDividendData(1);

        // Assert
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

      it('존재하지 않는 배당 ID로 요청 시 NotFoundException을 발생시켜야 합니다', async () => {
        // Arrange
        mockPrismaService.dividend.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.testDividendData(999)).rejects.toThrow(
          NotFoundException,
        );
        expect(mockPrismaService.dividend.update).not.toHaveBeenCalled();
      });

      it('이미 값이 있는 배당 데이터도 테스트 값으로 덮어써야 합니다', async () => {
        // Arrange
        const mockDividend = createMockDividend({
          dividendAmount: '0.25',
          dividendYield: '2.1%',
        });
        mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
        mockPrismaService.dividend.update.mockResolvedValue(mockDividend);

        // Act
        const result = await service.testDividendData(1);

        // Assert
        expect(mockPrismaService.dividend.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            dividendAmount: expect.any(String),
            dividendYield: expect.any(String),
          },
        });
        expect(result).toEqual({ success: true });
      });
    });

    describe('restoreDividendData', () => {
      it('배당 ID가 존재할 때 배당 데이터를 "--"로 복원해야 합니다', async () => {
        // Arrange
        const mockDividend = createMockDividend({
          dividendAmount: '5.25',
          dividendYield: '3.75%',
        });
        mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
        mockPrismaService.dividend.update.mockResolvedValue(mockDividend);

        // Act
        const result = await service.restoreDividendData(1);

        // Assert
        expect(mockPrismaService.dividend.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockPrismaService.dividend.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            dividendAmount: '--',
            dividendYield: '--',
          },
        });
        expect(result).toEqual({ success: true });
      });

      it('존재하지 않는 배당 ID로 복원 시 NotFoundException을 발생시켜야 합니다', async () => {
        // Arrange
        mockPrismaService.dividend.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.restoreDividendData(999)).rejects.toThrow(
          NotFoundException,
        );
        expect(mockPrismaService.dividend.update).not.toHaveBeenCalled();
      });

      it('이미 "--"인 배당 데이터도 복원 처리해야 합니다', async () => {
        // Arrange
        const mockDividend = createMockDividend({
          dividendAmount: '--',
          dividendYield: '--',
        });
        mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
        mockPrismaService.dividend.update.mockResolvedValue(mockDividend);

        // Act
        const result = await service.restoreDividendData(1);

        // Assert
        expect(mockPrismaService.dividend.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            dividendAmount: '--',
            dividendYield: '--',
          },
        });
        expect(result).toEqual({ success: true });
      });
    });

    describe('testDividendPayment', () => {
      it('배당 지급일 알림 테스트를 실행해야 합니다', async () => {
        // Arrange
        mockDividendScheduler.testDividendNotification.mockResolvedValue(
          undefined,
        );

        // Act
        const result = await service.testDividendPayment();

        // Assert
        expect(
          mockDividendScheduler.testDividendNotification,
        ).toHaveBeenCalledWith();
        expect(result).toEqual({
          message: '배당 지급일 알림 테스트가 실행되었습니다.',
        });
      });

      it('배당 스케줄러에서 에러가 발생해도 처리해야 합니다', async () => {
        // Arrange
        const testError = new Error('스케줄러 에러');
        mockDividendScheduler.testDividendNotification.mockRejectedValue(
          testError,
        );

        // Act & Assert
        await expect(service.testDividendPayment()).rejects.toThrow(
          '스케줄러 에러',
        );
        expect(
          mockDividendScheduler.testDividendNotification,
        ).toHaveBeenCalledWith();
      });
    });
  });
});
