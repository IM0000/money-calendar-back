import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotificationSSEService } from './notification-sse.service';

// Redis Mock 객체
const mockRedis = {
  publish: jest.fn().mockResolvedValue(1),
  subscribe: jest.fn().mockResolvedValue(1),
  unsubscribe: jest.fn().mockResolvedValue(1),
  disconnect: jest.fn(),
  ping: jest.fn().mockResolvedValue('PONG'),
  on: jest.fn(),
  status: 'ready',
};

// ioredis 모듈 전체를 모킹
jest.mock('ioredis', () => ({
  Redis: jest.fn().mockImplementation(() => mockRedis),
}));

describe('NotificationSSEService', () => {
  let service: NotificationSSEService;
  let configService: ConfigService;

  // 테스트 데이터 팩토리 함수들
  const createMockNotification = (overrides = {}) => ({
    id: 1,
    userId: 123,
    contentType: 'EARNINGS',
    contentId: 456,
    isRead: false,
    createdAt: new Date(),
    unreadCount: 5,
    ...overrides,
  });

  const createSSEPayload = (overrides = {}) => ({
    userId: 123,
    notificationId: 1,
    contentType: 'EARNINGS',
    contentId: 456,
    isRead: false,
    createdAt: new Date().toISOString(),
    type: 'notification' as const,
    data: { message: '테스트 메시지' },
    ...overrides,
  });

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: undefined,
        REDIS_DB: 0,
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationSSEService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<NotificationSSEService>(NotificationSSEService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock 초기화
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('모듈 초기화 및 종료', () => {
    describe('onModuleInit', () => {
      it('Redis 연결을 초기화해야 합니다', async () => {
        // Act
        await service.onModuleInit();

        // Assert
        expect(configService.get).toHaveBeenCalledWith(
          'REDIS_HOST',
          'localhost',
        );
        expect(configService.get).toHaveBeenCalledWith('REDIS_PORT', 6379);
        expect(mockRedis.subscribe).toHaveBeenCalledWith('notification.sse');
      });

      it('Redis 설정을 올바르게 조회해야 합니다', async () => {
        // Act
        await service.onModuleInit();

        // Assert
        expect(configService.get).toHaveBeenCalledWith(
          'REDIS_HOST',
          'localhost',
        );
        expect(configService.get).toHaveBeenCalledWith('REDIS_PORT', 6379);
        expect(configService.get).toHaveBeenCalledWith('REDIS_PASSWORD');
        expect(configService.get).toHaveBeenCalledWith('REDIS_DB', 0);
      });
    });

    describe('onModuleDestroy', () => {
      beforeEach(async () => {
        await service.onModuleInit();
      });

      it('Redis 연결을 정리해야 합니다', async () => {
        // Act
        await service.onModuleDestroy();

        // Assert
        expect(mockRedis.unsubscribe).toHaveBeenCalledWith('notification.sse');
        expect(mockRedis.disconnect).toHaveBeenCalledTimes(2); // publisher와 subscriber
      });

      it('여러 번 호출되어도 안전하게 처리해야 합니다', async () => {
        // Act
        await service.onModuleDestroy();
        await service.onModuleDestroy();

        // Assert - 에러가 발생하지 않아야 함
        expect(mockRedis.unsubscribe).toHaveBeenCalledWith('notification.sse');
        expect(mockRedis.disconnect).toHaveBeenCalled();
      });
    });
  });

  describe('알림 발행 기능', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    describe('publishNewNotification', () => {
      it('새 알림 이벤트를 Redis에 발행해야 합니다', async () => {
        // Arrange
        const notification = createMockNotification();

        // Act
        await service.publishNewNotification(notification);

        // Assert
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"type":"notification"'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"userId":123'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"unreadCount":5'),
        );
      });

      it('다른 사용자의 알림도 올바르게 발행해야 합니다', async () => {
        // Arrange
        const notification = createMockNotification({
          userId: 999,
          contentType: 'DIVIDEND',
          unreadCount: 10,
        });

        // Act
        await service.publishNewNotification(notification);

        // Assert
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"userId":999'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"contentType":"DIVIDEND"'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"unreadCount":10'),
        );
      });

      it('발행 실패 시 에러를 전파해야 합니다', async () => {
        // Arrange
        mockRedis.publish.mockRejectedValueOnce(new Error('Redis Error'));
        const notification = createMockNotification();

        // Act & Assert
        await expect(
          service.publishNewNotification(notification),
        ).rejects.toThrow('Redis Error');
      });

      it('읽음 상태가 true인 알림도 발행해야 합니다', async () => {
        // Arrange
        const notification = createMockNotification({
          isRead: true,
          unreadCount: 0,
        });

        // Act
        await service.publishNewNotification(notification);

        // Assert
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"isRead":true'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"unreadCount":0'),
        );
      });
    });

    describe('publishUnreadCountUpdate', () => {
      it('읽지 않은 알림 개수 업데이트 이벤트를 발행해야 합니다', async () => {
        // Arrange
        const userId = 123;
        const count = 5;

        // Act
        await service.publishUnreadCountUpdate(userId, count);

        // Assert
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"type":"count_update"'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"userId":123'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"unreadCount":5'),
        );
      });

      it('개수가 0인 경우도 올바르게 발행해야 합니다', async () => {
        // Arrange
        const userId = 456;
        const count = 0;

        // Act
        await service.publishUnreadCountUpdate(userId, count);

        // Assert
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"userId":456'),
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"unreadCount":0'),
        );
      });

      it('큰 개수도 올바르게 발행해야 합니다', async () => {
        // Arrange
        const userId = 789;
        const count = 9999;

        // Act
        await service.publishUnreadCountUpdate(userId, count);

        // Assert
        expect(mockRedis.publish).toHaveBeenCalledWith(
          'notification.sse',
          expect.stringContaining('"unreadCount":9999'),
        );
      });

      it('발행 실패 시 에러를 전파해야 합니다', async () => {
        // Arrange
        mockRedis.publish.mockRejectedValueOnce(
          new Error('Redis Connection Failed'),
        );

        // Act & Assert
        await expect(service.publishUnreadCountUpdate(123, 5)).rejects.toThrow(
          'Redis Connection Failed',
        );
      });
    });
  });

  describe('스트림 구독 기능', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    describe('getNotificationStream', () => {
      it('특정 사용자의 알림 스트림을 반환해야 합니다', (done) => {
        // Arrange
        const userId = 123;
        const testPayload = createSSEPayload({ userId: 123 });

        // Act
        const stream = service.getNotificationStream(userId);

        stream.subscribe({
          next: (message) => {
            // Assert
            expect(message.data.id).toBe(1);
            expect(message.data.type).toBe('notification');
            expect(message.data.contentType).toBe('EARNINGS');
            done();
          },
        });

        // Subject에 직접 메시지 발행 (테스트용)
        (service as any).notificationSubject.next(testPayload);
      });

      it('다른 사용자의 메시지는 필터링되어야 합니다', (done) => {
        // Arrange
        const userId = 123;
        const testPayload = createSSEPayload({ userId: 456 }); // 다른 사용자

        let messageReceived = false;

        // Act
        const stream = service.getNotificationStream(userId);

        stream.subscribe({
          next: () => {
            messageReceived = true;
          },
        });

        (service as any).notificationSubject.next(testPayload);

        // Assert
        setTimeout(() => {
          expect(messageReceived).toBe(false);
          done();
        }, 100);
      });

      it('count_update 타입 메시지도 올바르게 전달해야 합니다', (done) => {
        // Arrange
        const userId = 123;
        const testPayload = createSSEPayload({
          userId: 123,
          type: 'count_update' as const,
          data: { unreadCount: 5 },
        });

        // Act
        const stream = service.getNotificationStream(userId);

        stream.subscribe({
          next: (message) => {
            // Assert
            expect(message.data.type).toBe('count_update');
            expect(message.data.unreadCount).toBe(5);
            done();
          },
        });

        (service as any).notificationSubject.next(testPayload);
      });

      it('여러 사용자가 동시에 구독할 수 있어야 합니다', (done) => {
        // Arrange
        const user1Id = 123;
        const user2Id = 456;
        const user1Payload = createSSEPayload({ userId: user1Id });
        const user2Payload = createSSEPayload({ userId: user2Id });

        let user1MessageReceived = false;
        let user2MessageReceived = false;

        // Act
        const stream1 = service.getNotificationStream(user1Id);
        const stream2 = service.getNotificationStream(user2Id);

        stream1.subscribe({
          next: () => {
            user1MessageReceived = true;
            checkCompletion();
          },
        });

        stream2.subscribe({
          next: () => {
            user2MessageReceived = true;
            checkCompletion();
          },
        });

        function checkCompletion() {
          if (user1MessageReceived && user2MessageReceived) {
            // Assert
            expect(user1MessageReceived).toBe(true);
            expect(user2MessageReceived).toBe(true);
            done();
          }
        }

        // 각각의 메시지 발행
        (service as any).notificationSubject.next(user1Payload);
        (service as any).notificationSubject.next(user2Payload);
      });
    });
  });

  describe('연결 상태 확인 기능', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    describe('isConnected', () => {
      it('Redis 연결 상태가 ready일 때 true를 반환해야 합니다', () => {
        // Arrange
        mockRedis.status = 'ready';

        // Act
        const isConnected = service.isConnected();

        // Assert
        expect(isConnected).toBe(true);
      });

      it('Redis 연결 상태가 ready가 아닐 때 false를 반환해야 합니다', () => {
        // Arrange
        mockRedis.status = 'disconnected';

        // Act
        const isConnected = service.isConnected();

        // Assert
        expect(isConnected).toBe(false);
      });

      it('다양한 연결 상태를 올바르게 판단해야 합니다', () => {
        // Test cases for different status values
        const testCases = [
          { status: 'ready', expected: true },
          { status: 'connecting', expected: false },
          { status: 'disconnected', expected: false },
          { status: 'error', expected: false },
        ];

        testCases.forEach(({ status, expected }) => {
          // Arrange
          mockRedis.status = status;

          // Act
          const isConnected = service.isConnected();

          // Assert
          expect(isConnected).toBe(expected);
        });
      });
    });

    describe('testConnection', () => {
      it('연결 테스트가 성공하면 true를 반환해야 합니다', async () => {
        // Arrange
        mockRedis.ping.mockResolvedValue('PONG');

        // Act
        const result = await service.testConnection();

        // Assert
        expect(result).toBe(true);
        expect(mockRedis.ping).toHaveBeenCalled();
      });

      it('연결 테스트가 실패하면 false를 반환해야 합니다', async () => {
        // Arrange
        mockRedis.ping.mockRejectedValueOnce(new Error('Connection failed'));

        // Act
        const result = await service.testConnection();

        // Assert
        expect(result).toBe(false);
        expect(mockRedis.ping).toHaveBeenCalled();
      });

      it('타임아웃 에러도 올바르게 처리해야 합니다', async () => {
        // Arrange
        mockRedis.ping.mockRejectedValueOnce(new Error('Timeout'));

        // Act
        const result = await service.testConnection();

        // Assert
        expect(result).toBe(false);
      });

      it('네트워크 에러도 올바르게 처리해야 합니다', async () => {
        // Arrange
        mockRedis.ping.mockRejectedValueOnce(new Error('ECONNREFUSED'));

        // Act
        const result = await service.testConnection();

        // Assert
        expect(result).toBe(false);
      });
    });
  });
});
