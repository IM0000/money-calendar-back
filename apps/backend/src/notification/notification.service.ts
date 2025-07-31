import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentType, NotificationType } from '@prisma/client';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { NotificationQueueService } from './queue/notification-queue.service';
import { NotificationSSEService } from './sse/notification-sse.service';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly queueService: NotificationQueueService,
    private readonly sseService: NotificationSSEService,
  ) {}

  /**
   * 알림 생성 및 전송
   */
  async createNotification(dto: {
    contentType: ContentType;
    contentId: number;
    userId: number;
    notificationType: NotificationType;
    previousData?: any;
    currentData?: any;
  }) {
    const {
      contentType,
      contentId,
      userId,
      notificationType,
      previousData,
      currentData,
    } = dto;

    // 1. 구독 정보 및 사용자 정보 조회
    const subscriptionWithUser = await this.getSubscriptionWithUser(
      contentType,
      contentId,
      userId,
    );

    if (!subscriptionWithUser) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 2. 알림 DB 생성
    const notification = await this.notificationRepository.createNotification({
      userId,
      contentType,
      contentId,
      notificationType,
      isRead: false,
    });

    // 3. 사용자 알림 설정 조회
    const userSettings = await this.getUserNotificationSettings(
      subscriptionWithUser.user.id,
    );

    // 4. 큐에 알림 작업 추가
    await this.queueService.addNotificationJob({
      notificationId: notification.id,
      userId: subscriptionWithUser.user.id,
      userEmail: subscriptionWithUser.user.email,
      contentType,
      contentId,
      notificationType,
      previousData,
      currentData,
      userSettings,
    });

    // 5. 읽지 않은 알림 개수 조회 및 SSE 이벤트 발행
    const { count: unreadCount } = await this.getUnreadNotificationsCount(
      userId,
    );

    await this.sseService.publishNewNotification({
      id: notification.id,
      userId: notification.userId,
      contentType: notification.contentType,
      contentId: notification.contentId,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      unreadCount, // 정확한 읽지 않은 알림 개수 포함
    });

    return notification;
  }

  /**
   * 콘텐츠 타입별 구독 정보 조회
   */
  private async getSubscriptionWithUser(
    contentType: ContentType,
    contentId: number,
    userId: number,
  ) {
    switch (contentType) {
      case ContentType.EARNINGS:
        const earnings = await this.notificationRepository.findEarningsById(contentId);
        if (!earnings) return null;

        return this.notificationRepository.findCompanySubscription(
          userId,
          earnings.companyId,
        );

      case ContentType.DIVIDEND:
        const dividend = await this.notificationRepository.findDividendById(contentId);
        if (!dividend) return null;

        return this.notificationRepository.findCompanySubscription(
          userId,
          dividend.companyId,
        );

      case ContentType.ECONOMIC_INDICATOR:
        const indicator = await this.notificationRepository.findEconomicIndicatorById(contentId);
        if (!indicator) return null;

        return this.notificationRepository.findIndicatorGroupSubscription(
          userId,
          indicator.baseName,
          indicator.country,
        );

      default:
        throw new Error(`지원하지 않는 콘텐츠 타입: ${contentType}`);
    }
  }

  /**
   * 유저 알림 설정 조회 및 기본값 제공
   */
  async getUserNotificationSettings(userId: number) {
    const settings = await this.notificationRepository.findUserNotificationSettings(userId);

    if (settings) {
      return settings;
    }

    return this.notificationRepository.createUserNotificationSettings({
      userId,
      emailEnabled: false,
      slackEnabled: false,
      slackWebhookUrl: null,
      notificationsEnabled: true,
    });
  }

  /**
   * 유저 알림 설정 수정
   */
  async updateUserNotificationSettings(
    userId: number,
    dto: UpdateUserNotificationSettingsDto,
  ) {
    const {
      emailEnabled,
      slackEnabled,
      slackWebhookUrl,
      notificationsEnabled,
    } = dto;

    return this.notificationRepository.upsertUserNotificationSettings(
      userId,
      {
        ...(emailEnabled !== undefined && { emailEnabled }),
        ...(slackEnabled !== undefined && { slackEnabled }),
        ...(slackWebhookUrl !== undefined && {
          slackWebhookUrl,
        }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      },
      {
        userId,
        emailEnabled: emailEnabled ?? false,
        slackEnabled: slackEnabled ?? false,
        slackWebhookUrl,
        notificationsEnabled: notificationsEnabled ?? true,
      },
    );
  }

  /**
   * 유저 알림 목록 조회 (통합된 Notification 모델 사용)
   */
  async getUserNotifications(userId: number, page = 1, limit = 100) {
    // 1) 기본 Notification만 먼저 가져오기
    const skip = (page - 1) * limit;
    const [notifications, totalCount] = await Promise.all([
      this.notificationRepository.findUserNotifications(userId, skip, limit),
      this.notificationRepository.countUserNotifications(userId),
    ]);

    // 2) contentType 별로 ID 배열 뽑기
    const earningsIds: number[] = [];
    const dividendIds: number[] = [];
    const indicatorIds: number[] = [];
    for (const n of notifications) {
      if (n.contentType === ContentType.EARNINGS) {
        earningsIds.push(n.contentId);
      } else if (n.contentType === ContentType.DIVIDEND) {
        dividendIds.push(n.contentId);
      } else if (n.contentType === ContentType.ECONOMIC_INDICATOR) {
        indicatorIds.push(n.contentId);
      }
    }

    // 3) 실제 Earnings / Dividend / EconomicIndicator 데이터를 각각 한 번씩만 조회
    const [earningsMap, dividendMap, indicatorMap] = await Promise.all([
      (async () => {
        const earningsList = await this.notificationRepository.findEarningsByIds(earningsIds);
        return Object.fromEntries(earningsList.map((e) => [e.id, e]));
      })(),

      (async () => {
        const dividendList = await this.notificationRepository.findDividendsByIds(dividendIds);
        return Object.fromEntries(dividendList.map((d) => [d.id, d]));
      })(),

      (async () => {
        const indicatorList = await this.notificationRepository.findEconomicIndicatorsByIds(indicatorIds);
        return Object.fromEntries(indicatorList.map((i) => [i.id, i]));
      })(),
    ]);

    // 4) 원래 Notification 배열 순서대로 매핑 (BigInt 직렬화 처리)
    const enrichedNotifications = notifications.map((n) => {
      let contentDetails = null;

      if (n.contentType === ContentType.EARNINGS) {
        const earnings = earningsMap[n.contentId];
        if (earnings) {
          contentDetails = {
            ...earnings,
            releaseDate: Number(earnings.releaseDate),
            createdAt: earnings.createdAt.toISOString(),
            updatedAt: earnings.updatedAt.toISOString(),
          };
        }
      } else if (n.contentType === ContentType.DIVIDEND) {
        const dividend = dividendMap[n.contentId];
        if (dividend) {
          contentDetails = {
            ...dividend,
            exDividendDate: Number(dividend.exDividendDate),
            paymentDate: Number(dividend.paymentDate),
            createdAt: dividend.createdAt.toISOString(),
            updatedAt: dividend.updatedAt.toISOString(),
          };
        }
      } else if (n.contentType === ContentType.ECONOMIC_INDICATOR) {
        const indicator = indicatorMap[n.contentId];
        if (indicator) {
          contentDetails = {
            ...indicator,
            releaseDate: Number(indicator.releaseDate),
            createdAt: indicator.createdAt.toISOString(),
            updatedAt: indicator.updatedAt.toISOString(),
          };
        }
      }

      return {
        id: n.id,
        userId: n.userId,
        contentType: n.contentType,
        contentId: n.contentId,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
        contentDetails,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      notifications: enrichedNotifications,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadNotificationsCount(
    userId: number,
  ): Promise<{ count: number }> {
    const count = await this.notificationRepository.countUnreadNotifications(userId);

    return { count };
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(userId: number, notificationId: number) {
    // 통합된 Notification 모델에서 알림 찾기
    const notification = await this.notificationRepository.findNotificationById(notificationId);

    if (!notification) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 사용자 권한 확인
    if (notification.userId !== userId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE_MAP.AUTHZ_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTHZ_001,
      });
    }

    // 알림 읽음 상태로 업데이트
    await this.notificationRepository.markNotificationAsRead(notificationId);

    // 읽지 않은 알림 개수 업데이트 이벤트 발행
    const unreadCount = await this.notificationRepository.countUnreadNotifications(userId);

    await this.sseService.publishUnreadCountUpdate(userId, unreadCount);

    return { message: '알림이 읽음으로 변경되었습니다.' };
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(userId: number) {
    const result = await this.notificationRepository.markAllUserNotificationsAsRead(userId);

    // 읽지 않은 알림 개수 0으로 업데이트 이벤트 발행
    await this.sseService.publishUnreadCountUpdate(userId, 0);

    return {
      message: '모든 알림을 읽음으로 표시했습니다.',
      count: result.count,
    };
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.notificationRepository.findNotificationById(notificationId);

    if (!notification) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE_MAP.AUTHZ_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTHZ_001,
      });
    }

    await this.notificationRepository.deleteNotification(notificationId);

    return { message: '알림이 삭제되었습니다.' };
  }

  /**
   * 사용자의 모든 알림 삭제
   */
  async deleteAllUserNotifications(userId: number) {
    const result = await this.notificationRepository.deleteAllUserNotifications(userId);

    return {
      message: '모든 알림이 삭제되었습니다.',
      count: result.count,
    };
  }
}
