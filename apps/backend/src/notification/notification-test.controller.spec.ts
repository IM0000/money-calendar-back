import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTestController } from './notification-test.controller';
import { NotificationTestService } from './notification-test.service';

describe('NotificationTestController', () => {
  let controller: NotificationTestController;
  let service: NotificationTestService;

  const mockNotificationTestService = {
    testIndicatorActual: jest.fn(),
    restoreIndicatorActual: jest.fn(),
    testEarningsActual: jest.fn(),
    restoreEarningsActual: jest.fn(),
    testDividendData: jest.fn(),
    restoreDividendData: jest.fn(),
    testDividendPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationTestController],
      providers: [
        {
          provide: NotificationTestService,
          useValue: mockNotificationTestService,
        },
      ],
    }).compile();

    controller = module.get<NotificationTestController>(
      NotificationTestController,
    );
    service = module.get<NotificationTestService>(NotificationTestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('정의되어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  describe('testIndicatorActual', () => {
    it('제공된 ID로 testIndicatorActual을 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.testIndicatorActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.testIndicatorActual('1');

      expect(service.testIndicatorActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('restoreIndicatorActual', () => {
    it('제공된 ID로 restoreIndicatorActual을 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.restoreIndicatorActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.restoreIndicatorActual('1');

      expect(service.restoreIndicatorActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('testEarningsActual', () => {
    it('제공된 ID로 testEarningsActual을 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.testEarningsActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.testEarningsActual('1');

      expect(service.testEarningsActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('restoreEarningsActual', () => {
    it('제공된 ID로 restoreEarningsActual을 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.restoreEarningsActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.restoreEarningsActual('1');

      expect(service.restoreEarningsActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('testDividendData', () => {
    it('제공된 ID로 testDividendData를 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.testDividendData.mockResolvedValue(
        mockResult,
      );

      const result = await controller.testDividendData('1');

      expect(service.testDividendData).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('restoreDividendData', () => {
    it('제공된 ID로 restoreDividendData를 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.restoreDividendData.mockResolvedValue(
        mockResult,
      );

      const result = await controller.restoreDividendData('1');

      expect(service.restoreDividendData).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('testDividendPayment', () => {
    it('testDividendPayment를 호출해야 합니다', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.testDividendPayment.mockResolvedValue(
        mockResult,
      );

      const result = await controller.testDividendPayment();

      expect(service.testDividendPayment).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
