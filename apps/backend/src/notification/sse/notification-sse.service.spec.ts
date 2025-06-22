import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotificationSSEService } from './notification-sse.service';

// Redis Mock
const mockRedis = {
  publish: jest.fn().mockResolvedValue(1),
  subscribe: jest.fn().mockResolvedValue(1),
  unsubscribe: jest.fn().mockResolvedValue(1),
  disconnect: jest.fn(),
  ping: jest.fn().mockResolvedValue('PONG'),
  on: jest.fn(),
  status: 'ready',
};

// Redis 생성자 Mock
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedis);
});

describe('NotificationSSEService', () => {
  let service: NotificationSSEService;
  let configService: ConfigService;

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

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('모듈 초기화', () => {
    it('Redis 연결을 초기화해야 한다', async () => {
      await service.onModuleInit();

      expect(configService.get).toHaveBeenCalledWith('REDIS_HOST', 'localhost');
      expect(configService.get).toHaveBeenCalledWith('REDIS_PORT', 6379);
      expect(mockRedis.subscribe).toHaveBeenCalledWith('notification.sse');
    });
  });

  describe('알림 발행', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('새 알림 이벤트를 발행해야 한다', async () => {
      const notification = {
        id: 1,
        userId: 123,
        contentType: 'EARNINGS',
        contentId: 456,
        isRead: false,
        createdAt: new Date(),
        unreadCount: 5,
      };

      await service.publishNewNotification(notification);

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

    it('읽지 않은 알림 개수 업데이트 이벤트를 발행해야 한다', async () => {
      const userId = 123;
      const count = 5;

      await service.publishUnreadCountUpdate(userId, count);

      expect(mockRedis.publish).toHaveBeenCalledWith(
        'notification.sse',
        expect.stringContaining('"type":"count_update"'),
      );
      expect(mockRedis.publish).toHaveBeenCalledWith(
        'notification.sse',
        expect.stringContaining('"unreadCount":5'),
      );
    });

    it('발행 실패 시 에러를 던져야 한다', async () => {
      mockRedis.publish.mockRejectedValueOnce(new Error('Redis Error'));

      const notification = {
        id: 1,
        userId: 123,
        contentType: 'EARNINGS',
        contentId: 456,
        isRead: false,
        createdAt: new Date(),
        unreadCount: 3,
      };

      await expect(
        service.publishNewNotification(notification),
      ).rejects.toThrow('Redis Error');
    });
  });

  describe('스트림 구독', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('특정 사용자의 알림 스트림을 반환해야 한다', (done) => {
      const userId = 123;
      const stream = service.getNotificationStream(userId);

      // 테스트용 메시지 발행
      const testPayload = {
        userId: 123,
        notificationId: 1,
        contentType: 'EARNINGS',
        contentId: 456,
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'notification' as const,
        data: { message: '테스트 메시지' },
      };

      stream.subscribe({
        next: (message) => {
          expect(message.data.id).toBe(1);
          expect(message.data.type).toBe('notification');
          expect(message.data.contentType).toBe('EARNINGS');
          done();
        },
      });

      // Subject에 직접 메시지 발행 (테스트용)
      (service as any).notificationSubject.next(testPayload);
    });

    it('다른 사용자의 메시지는 필터링되어야 한다', (done) => {
      const userId = 123;
      const stream = service.getNotificationStream(userId);

      let messageReceived = false;

      stream.subscribe({
        next: () => {
          messageReceived = true;
        },
      });

      // 다른 사용자의 메시지 발행
      const testPayload = {
        userId: 456, // 다른 사용자
        notificationId: 1,
        contentType: 'EARNINGS',
        contentId: 456,
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'notification' as const,
        data: { message: '테스트 메시지' },
      };

      (service as any).notificationSubject.next(testPayload);

      // 잠시 후 메시지가 수신되지 않았는지 확인
      setTimeout(() => {
        expect(messageReceived).toBe(false);
        done();
      }, 100);
    });
  });

  describe('연결 상태 확인', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('Redis 연결 상태를 확인해야 한다', () => {
      const isConnected = service.isConnected();
      expect(isConnected).toBe(true);
    });

    it('연결 테스트를 수행해야 한다', async () => {
      const result = await service.testConnection();
      expect(result).toBe(true);
      expect(mockRedis.ping).toHaveBeenCalled();
    });

    it('연결 테스트 실패 시 false를 반환해야 한다', async () => {
      mockRedis.ping.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await service.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('모듈 종료', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('Redis 연결을 정리해야 한다', async () => {
      await service.onModuleDestroy();

      expect(mockRedis.unsubscribe).toHaveBeenCalledWith('notification.sse');
      expect(mockRedis.disconnect).toHaveBeenCalledTimes(2); // publisher와 subscriber
    });
  });
});
