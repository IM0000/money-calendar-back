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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('testIndicator', () => {
    it('should call testIndicatorActual with the provided id', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.testIndicatorActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.testIndicator(1);

      expect(service.testIndicatorActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('restoreIndicator', () => {
    it('should call restoreIndicatorActual with the provided id', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.restoreIndicatorActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.restoreIndicator(1);

      expect(service.restoreIndicatorActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('testEarnings', () => {
    it('should call testEarningsActual with the provided id', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.testEarningsActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.testEarnings(1);

      expect(service.testEarningsActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('restoreEarnings', () => {
    it('should call restoreEarningsActual with the provided id', async () => {
      const mockResult = { success: true };
      mockNotificationTestService.restoreEarningsActual.mockResolvedValue(
        mockResult,
      );

      const result = await controller.restoreEarnings(1);

      expect(service.restoreEarningsActual).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });
});
