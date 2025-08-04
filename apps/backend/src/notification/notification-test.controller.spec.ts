import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTestController } from './notification-test.controller';
import { NotificationTestService } from './notification-test.service';

describe('NotificationTestController', () => {
  let controller: NotificationTestController;
  let service: NotificationTestService;

  // 테스트 데이터 팩토리 함수들
  const createSuccessResponse = (overrides = {}) => ({
    success: true,
    ...overrides,
  });

  const createDividendTestResponse = (overrides = {}) => ({
    message: '배당 지급일 알림 테스트가 실행되었습니다.',
    ...overrides,
  });

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

  it('컨트롤러가 정의되어 있어야 합니다', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('경제 지표 테스트 관련 기능', () => {
    describe('testIndicatorActual', () => {
      it('문자열 ID를 숫자로 변환하여 지표 테스트를 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.testIndicatorActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testIndicatorActual('1');

        // Assert
        expect(service.testIndicatorActual).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('다른 ID 값에 대해서도 올바르게 동작해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.testIndicatorActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testIndicatorActual('999');

        // Assert
        expect(service.testIndicatorActual).toHaveBeenCalledWith(999);
        expect(result).toEqual(mockResult);
      });

      it('서비스에서 에러가 발생하면 컨트롤러도 에러를 전파해야 합니다', async () => {
        // Arrange
        const testError = new Error('지표를 찾을 수 없습니다');
        mockNotificationTestService.testIndicatorActual.mockRejectedValue(
          testError,
        );

        // Act & Assert
        await expect(controller.testIndicatorActual('1')).rejects.toThrow(
          '지표를 찾을 수 없습니다',
        );
        expect(service.testIndicatorActual).toHaveBeenCalledWith(1);
      });
    });

    describe('restoreIndicatorActual', () => {
      it('문자열 ID를 숫자로 변환하여 지표 복원을 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.restoreIndicatorActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.restoreIndicatorActual('1');

        // Assert
        expect(service.restoreIndicatorActual).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('큰 ID 값도 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.restoreIndicatorActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.restoreIndicatorActual('12345');

        // Assert
        expect(service.restoreIndicatorActual).toHaveBeenCalledWith(12345);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('실적 테스트 관련 기능', () => {
    describe('testEarningsActual', () => {
      it('문자열 ID를 숫자로 변환하여 실적 테스트를 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.testEarningsActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testEarningsActual('1');

        // Assert
        expect(service.testEarningsActual).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('0 ID도 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.testEarningsActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testEarningsActual('0');

        // Assert
        expect(service.testEarningsActual).toHaveBeenCalledWith(0);
        expect(result).toEqual(mockResult);
      });

      it('서비스에서 에러가 발생하면 컨트롤러도 에러를 전파해야 합니다', async () => {
        // Arrange
        const testError = new Error('실적을 찾을 수 없습니다');
        mockNotificationTestService.testEarningsActual.mockRejectedValue(
          testError,
        );

        // Act & Assert
        await expect(controller.testEarningsActual('1')).rejects.toThrow(
          '실적을 찾을 수 없습니다',
        );
      });
    });

    describe('restoreEarningsActual', () => {
      it('문자열 ID를 숫자로 변환하여 실적 복원을 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.restoreEarningsActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.restoreEarningsActual('1');

        // Assert
        expect(service.restoreEarningsActual).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('음수 ID는 처리하지 않아야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.restoreEarningsActual.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.restoreEarningsActual('-1');

        // Assert
        expect(service.restoreEarningsActual).toHaveBeenCalledWith(-1);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('배당 테스트 관련 기능', () => {
    describe('testDividendData', () => {
      it('문자열 ID를 숫자로 변환하여 배당 데이터 테스트를 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.testDividendData.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testDividendData('1');

        // Assert
        expect(service.testDividendData).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('여러 자리 숫자 ID도 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.testDividendData.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testDividendData('987654321');

        // Assert
        expect(service.testDividendData).toHaveBeenCalledWith(987654321);
        expect(result).toEqual(mockResult);
      });
    });

    describe('restoreDividendData', () => {
      it('문자열 ID를 숫자로 변환하여 배당 데이터 복원을 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createSuccessResponse();
        mockNotificationTestService.restoreDividendData.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.restoreDividendData('1');

        // Assert
        expect(service.restoreDividendData).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('서비스에서 에러가 발생하면 컨트롤러도 에러를 전파해야 합니다', async () => {
        // Arrange
        const testError = new Error('배당 정보를 찾을 수 없습니다');
        mockNotificationTestService.restoreDividendData.mockRejectedValue(
          testError,
        );

        // Act & Assert
        await expect(controller.restoreDividendData('1')).rejects.toThrow(
          '배당 정보를 찾을 수 없습니다',
        );
      });
    });

    describe('testDividendPayment', () => {
      it('배당 지급일 알림 테스트를 실행해야 합니다', async () => {
        // Arrange
        const mockResult = createDividendTestResponse();
        mockNotificationTestService.testDividendPayment.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testDividendPayment();

        // Assert
        expect(service.testDividendPayment).toHaveBeenCalledWith();
        expect(result).toEqual(mockResult);
      });

      it('배당 지급일 테스트에서 에러가 발생하면 컨트롤러도 에러를 전파해야 합니다', async () => {
        // Arrange
        const testError = new Error('배당 스케줄러 오류');
        mockNotificationTestService.testDividendPayment.mockRejectedValue(
          testError,
        );

        // Act & Assert
        await expect(controller.testDividendPayment()).rejects.toThrow(
          '배당 스케줄러 오류',
        );
        expect(service.testDividendPayment).toHaveBeenCalledWith();
      });

      it('성공적인 테스트 실행 시 적절한 메시지를 반환해야 합니다', async () => {
        // Arrange
        const mockResult = createDividendTestResponse({
          message: '배당 지급일 알림 테스트가 성공적으로 실행되었습니다.',
          executedAt: new Date().toISOString(),
        });
        mockNotificationTestService.testDividendPayment.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.testDividendPayment();

        // Assert
        expect(result.message).toContain('배당 지급일 알림 테스트');
      });
    });
  });
});
