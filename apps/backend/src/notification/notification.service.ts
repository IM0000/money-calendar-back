import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType, NotificationType } from '@prisma/client';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { NotificationQueueService } from './queue/notification-queue.service';
import { NotificationSSEService } from './sse/notification-sse.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
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
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        contentType,
        contentId,
        notificationType,
        isRead: false,
      },
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
        const earnings = await this.prisma.earnings.findUnique({
          where: { id: contentId },
          include: { company: true },
        });
        if (!earnings) return null;

        return this.prisma.subscriptionCompany.findFirst({
          where: { userId, companyId: earnings.companyId, isActive: true },
          include: { user: true },
        });

      case ContentType.DIVIDEND:
        const dividend = await this.prisma.dividend.findUnique({
          where: { id: contentId },
          include: { company: true },
        });
        if (!dividend) return null;

        return this.prisma.subscriptionCompany.findFirst({
          where: { userId, companyId: dividend.companyId, isActive: true },
          include: { user: true },
        });

      case ContentType.ECONOMIC_INDICATOR:
        const indicator = await this.prisma.economicIndicator.findUnique({
          where: { id: contentId },
        });
        if (!indicator) return null;

        return this.prisma.subscriptionIndicatorGroup.findFirst({
          where: {
            userId,
            baseName: indicator.baseName,
            country: indicator.country,
            isActive: true,
          },
          include: { user: true },
        });

      default:
        throw new Error(`지원하지 않는 콘텐츠 타입: ${contentType}`);
    }
  }

  /**
   * 유저 알림 설정 조회 및 기본값 제공
   */
  async getUserNotificationSettings(userId: number) {
    const settings = await this.prisma.userNotificationSettings.findUnique({
      where: { userId },
    });

    if (settings) {
      return settings;
    }

    return this.prisma.userNotificationSettings.create({
      data: {
        userId,
        emailEnabled: false,
        slackEnabled: false,
        slackWebhookUrl: null,
        notificationsEnabled: true,
      },
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

    return this.prisma.userNotificationSettings.upsert({
      where: { userId },
      update: {
        ...(emailEnabled !== undefined && { emailEnabled }),
        ...(slackEnabled !== undefined && { slackEnabled }),
        ...(slackWebhookUrl !== undefined && {
          slackWebhookUrl,
        }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      },
      create: {
        userId,
        emailEnabled: emailEnabled ?? false,
        slackEnabled: slackEnabled ?? false,
        slackWebhookUrl,
        notificationsEnabled: notificationsEnabled ?? true,
      },
    });
  }

  /**
   * 유저 알림 목록 조회 (통합된 Notification 모델 사용)
   */
  async getUserNotifications(userId: number, page = 1, limit = 100) {
    // 1) 기본 Notification만 먼저 가져오기
    const skip = (page - 1) * limit;
    const [notifications, totalCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
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
        if (earningsIds.length === 0) return {};
        const earningsList = await this.prisma.earnings.findMany({
          where: { id: { in: earningsIds } },
          include: { company: true }, // 필요에 따라 include
        });
        return Object.fromEntries(earningsList.map((e) => [e.id, e]));
      })(),

      (async () => {
        if (dividendIds.length === 0) return {};
        const dividendList = await this.prisma.dividend.findMany({
          where: { id: { in: dividendIds } },
          include: { company: true }, // 필요에 따라 include
        });
        return Object.fromEntries(dividendList.map((d) => [d.id, d]));
      })(),

      (async () => {
        if (indicatorIds.length === 0) return {};
        const indicatorList = await this.prisma.economicIndicator.findMany({
          where: { id: { in: indicatorIds } },
        });
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
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(userId: number, notificationId: number) {
    // 통합된 Notification 모델에서 알림 찾기
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

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
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    // 읽지 않은 알림 개수 업데이트 이벤트 발행
    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    await this.sseService.publishUnreadCountUpdate(userId, unreadCount);

    return { message: '알림이 읽음으로 변경되었습니다.' };
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

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
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

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

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: '알림이 삭제되었습니다.' };
  }

  /**
   * 사용자의 모든 알림 삭제
   */
  async deleteAllUserNotifications(userId: number) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return {
      message: '모든 알림이 삭제되었습니다.',
      count: result.count,
    };
  }
}
