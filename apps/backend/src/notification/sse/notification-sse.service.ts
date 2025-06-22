import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export interface NotificationSSEPayload {
  userId: number;
  notificationId: number;
  contentType: string;
  contentId: number;
  isRead: boolean;
  createdAt: string;
  type: 'notification' | 'count_update';
  data?: any;
}

/**
 * Redis Pub/Sub 기반 SSE 서비스
 * 다중 서버 인스턴스 환경에서 실시간 알림 브로드캐스트 지원
 */
@Injectable()
export class NotificationSSEService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationSSEService.name);
  private readonly NOTIFICATION_CHANNEL = 'notification.sse';

  private redisPublisher: Redis;
  private redisSubscriber: Redis;
  private notificationSubject = new Subject<NotificationSSEPayload>();

  public readonly notification$ = this.notificationSubject.asObservable();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeRedis();
    this.setupSubscriber();
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  /**
   * Redis 연결 초기화
   */
  private async initializeRedis() {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    };

    this.redisPublisher = new Redis(redisConfig);
    this.redisSubscriber = new Redis(redisConfig);

    this.redisPublisher.on('error', (error) => {
      this.logger.error('Redis Publisher 연결 오류:', error);
    });

    this.redisSubscriber.on('error', (error) => {
      this.logger.error('Redis Subscriber 연결 오류:', error);
    });

    this.logger.log('Redis Pub/Sub 연결 완료');
  }

  /**
   * Redis 구독자 설정
   */
  private setupSubscriber() {
    this.redisSubscriber.subscribe(this.NOTIFICATION_CHANNEL);

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === this.NOTIFICATION_CHANNEL) {
        try {
          const payload: NotificationSSEPayload = JSON.parse(message);
          this.notificationSubject.next(payload);
          this.logger.debug(
            `SSE 메시지 브로드캐스트: 사용자 ${payload.userId}`,
          );
        } catch (error) {
          this.logger.error('SSE 메시지 파싱 오류:', error, message);
        }
      }
    });

    this.logger.log(`Redis 채널 구독 시작: ${this.NOTIFICATION_CHANNEL}`);
  }

  /**
   * 알림 이벤트 발행
   */
  async publishNotification(payload: NotificationSSEPayload): Promise<void> {
    try {
      const message = JSON.stringify(payload);
      await this.redisPublisher.publish(this.NOTIFICATION_CHANNEL, message);

      this.logger.debug(
        `알림 이벤트 발행: 사용자 ${payload.userId}, 타입 ${payload.type}`,
      );
    } catch (error) {
      this.logger.error('알림 이벤트 발행 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 사용자의 알림 스트림 구독
   */
  getNotificationStream(userId: number): Observable<{ data: any }> {
    return this.notification$.pipe(
      filter((payload) => payload.userId === userId),
      map((payload) => ({
        data: {
          id: payload.notificationId,
          type: payload.type,
          contentType: payload.contentType,
          contentId: payload.contentId,
          isRead: payload.isRead,
          createdAt: payload.createdAt,
          ...payload.data,
        },
      })),
    );
  }

  /**
   * 읽지 않은 알림 개수 업데이트 이벤트 발행
   */
  async publishUnreadCountUpdate(userId: number, count: number): Promise<void> {
    await this.publishNotification({
      userId,
      notificationId: 0,
      contentType: 'count_update',
      contentId: 0,
      isRead: false,
      createdAt: new Date().toISOString(),
      type: 'count_update',
      data: { unreadCount: count },
    });
  }

  /**
   * 새 알림 생성 이벤트 발행 (읽지 않은 개수 포함)
   */
  async publishNewNotification(notification: {
    id: number;
    userId: number;
    contentType: string;
    contentId: number;
    isRead: boolean;
    createdAt: Date;
    unreadCount: number; // 현재 읽지 않은 알림 총 개수
  }): Promise<void> {
    await this.publishNotification({
      userId: notification.userId,
      notificationId: notification.id,
      contentType: notification.contentType,
      contentId: notification.contentId,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
      type: 'notification',
      data: {
        message: '새로운 알림이 도착했습니다.',
        unreadCount: notification.unreadCount, // 정확한 개수 포함
      },
    });
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return (
      this.redisPublisher?.status === 'ready' &&
      this.redisSubscriber?.status === 'ready'
    );
  }

  /**
   * 정리 작업
   */
  private async cleanup() {
    try {
      if (this.redisSubscriber) {
        await this.redisSubscriber.unsubscribe(this.NOTIFICATION_CHANNEL);
        this.redisSubscriber.disconnect();
      }

      if (this.redisPublisher) {
        this.redisPublisher.disconnect();
      }

      this.notificationSubject.complete();
      this.logger.log('Redis Pub/Sub 연결 종료 완료');
    } catch (error) {
      this.logger.error('Redis 연결 종료 중 오류:', error);
    }
  }

  /**
   * 헬스체크용 연결 테스트
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.redisPublisher.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis 연결 테스트 실패:', error);
      return false;
    }
  }
}
