// notification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';
import {
  CreateNotificationDto,
  UpdateUserNotificationSettingsDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 구독 테이블에서 해당 콘텐츠 구독자를 조회
   */
  async findContentSubscriptions(type: ContentType, contentId: number) {
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.indicatorNotification.findMany({
          where: { indicatorId: contentId },
          include: { user: { include: { notificationSettings: true } } },
        });
      case ContentType.EARNINGS:
        return this.prisma.earningsNotification.findMany({
          where: { earningsId: contentId },
          include: { user: { include: { notificationSettings: true } } },
        });
      default:
        throw new NotFoundException('지원하지 않는 콘텐츠 타입입니다.');
    }
  }

  /**
   * Notification 레코드 생성
   */
  createNotification(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        contentType: dto.contentType,
        contentId: dto.contentId,
        userId: dto.userId,
      },
    });
  }

  /**
   * 유저 알림 설정 조회 및 기본값 제공
   */
  async getUserNotificationSettings(userId: number) {
    const settings = await this.prisma.userNotificationSettings.findUnique({
      where: { userId },
    });
    if (!settings) {
      return { emailEnabled: true, pushEnabled: true, preferredMethod: 'BOTH' };
    }
    return settings;
  }

  /**
   * 유저 알림 설정 수정
   */
  updateUserNotificationSettings(
    userId: number,
    dto: UpdateUserNotificationSettingsDto,
  ) {
    return this.prisma.userNotificationSettings.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  /**
   * 콘텐츠 구독 등록 (earnings/indicator)
   */
  async subscribeContent(userId: number, type: ContentType, contentId: number) {
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.indicatorNotification.upsert({
          where: { userId_indicatorId: { userId, indicatorId: contentId } },
          update: {},
          create: { userId, indicatorId: contentId },
        });
      case ContentType.EARNINGS:
        return this.prisma.earningsNotification.upsert({
          where: { userId_earningsId: { userId, earningsId: contentId } },
          update: {},
          create: { userId, earningsId: contentId },
        });
      default:
        throw new NotFoundException('지원하지 않는 콘텐츠 타입입니다.');
    }
  }

  /**
   * 콘텐츠 구독 해제 (earnings/indicator)
   */
  async unsubscribeContent(
    userId: number,
    type: ContentType,
    contentId: number,
  ) {
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.indicatorNotification.delete({
          where: { userId_indicatorId: { userId, indicatorId: contentId } },
        });
      case ContentType.EARNINGS:
        return this.prisma.earningsNotification.delete({
          where: { userId_earningsId: { userId, earningsId: contentId } },
        });
      default:
        throw new NotFoundException('지원하지 않는 콘텐츠 타입입니다.');
    }
  }

  async getUserNotifications(userId: number, page = 1, limit = 100) {
    const skip = (page - 1) * limit;

    // 1) 알림과 총 개수
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    // 2) contentType 별 ID 분리
    const indicatorIds = notifications
      .filter((n) => n.contentType === ContentType.ECONOMIC_INDICATOR)
      .map((n) => n.contentId);
    const earningsIds = notifications
      .filter((n) => n.contentType === ContentType.EARNINGS)
      .map((n) => n.contentId);

    // 3) 두 모델을 한 번씩 batch‐fetch (company 까지 포함)
    const [indicators, earnings] = await Promise.all([
      this.prisma.economicIndicator.findMany({
        where: { id: { in: indicatorIds } },
      }),
      this.prisma.earnings.findMany({
        where: { id: { in: earningsIds } },
        include: { company: true },
      }),
    ]);

    // 4) 원본 알림에 세부정보를 붙여서 새로운 배열 생성
    const detailed = notifications.map((n) => {
      if (n.contentType === ContentType.ECONOMIC_INDICATOR) {
        const detail = indicators.find((i) => i.id === n.contentId)!;
        return {
          ...n,
          // 이제 프론트에서 eventName, actual, forecast, releaseDate 등 모두 접근 가능
          eventName: detail.name,
          actual: detail.actual,
          forecast: detail.forecast,
          releaseDate: Number(detail.releaseDate),
        };
      }
      if (n.contentType === ContentType.EARNINGS) {
        const detail = earnings.find((e) => e.id === n.contentId)!;
        return {
          ...n,
          eventName: detail.company.name,
          actualEPS: detail.actualEPS,
          forecastEPS: detail.forecastEPS,
          actualRevenue: detail.actualRevenue,
          forecastRevenue: detail.forecastRevenue,
          releaseDate: Number(detail.releaseDate),
        };
      }
      return n;
    });

    return { notifications: detailed, total };
  }

  async getUnreadNotificationsCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async markAsRead(userId: number, notificationId: number) {
    const noti = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!noti || noti.userId !== userId) {
      throw new NotFoundException('알림을 찾을 수 없거나 권한이 없습니다.');
    }
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return { message: '알림이 읽음으로 변경되었습니다.' };
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return {
      message: '모든 알림을 읽음으로 표시했습니다.',
      count: result.count,
    };
  }

  async deleteUserNotification(userId: number, notificationId: number) {
    const noti = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!noti || noti.userId !== userId) {
      throw new NotFoundException('알림을 찾을 수 없거나 권한이 없습니다.');
    }
    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { message: '알림이 삭제되었습니다.' };
  }

  async addEarningsNotification(userId: number, earningsId: number) {
    return this.subscribeContent(userId, ContentType.EARNINGS, earningsId);
  }

  async removeEarningsNotification(userId: number, earningsId: number) {
    return this.unsubscribeContent(userId, ContentType.EARNINGS, earningsId);
  }

  async addDividendNotification(userId: number, dividendId: number) {
    return this.createNotification({
      contentType: ContentType.DIVIDEND,
      contentId: dividendId,
      userId,
    });
  }

  async removeDividendNotification(userId: number, dividendId: number) {
    const noti = await this.prisma.notification.findFirst({
      where: {
        userId,
        contentType: ContentType.DIVIDEND,
        contentId: dividendId,
      },
    });
    if (!noti) throw new NotFoundException('배당 알림이 없습니다.');
    await this.prisma.notification.delete({ where: { id: noti.id } });
    return { message: '배당 알림이 해제되었습니다.' };
  }

  async addEconomicIndicatorNotification(userId: number, indicatorId: number) {
    return this.subscribeContent(
      userId,
      ContentType.ECONOMIC_INDICATOR,
      indicatorId,
    );
  }

  async removeEconomicIndicatorNotification(
    userId: number,
    indicatorId: number,
  ) {
    return this.unsubscribeContent(
      userId,
      ContentType.ECONOMIC_INDICATOR,
      indicatorId,
    );
  }

  async getNotificationCalendar(userId: number) {
    const indicatorNotifications =
      await this.prisma.indicatorNotification.findMany({
        where: { userId },
        include: { indicator: true },
        orderBy: { indicator: { releaseDate: 'desc' } },
      });
    const earningsNotifications =
      await this.prisma.earningsNotification.findMany({
        where: { userId },
        include: { earnings: { include: { company: true } } },
        orderBy: { earnings: { releaseDate: 'desc' } },
      });
    const economicIndicators = indicatorNotifications.map(({ indicator }) => ({
      id: indicator.id,
      name: indicator.name,
      country: indicator.country,
      importance: indicator.importance,
      releaseDate: Number(indicator.releaseDate),
      actual: indicator.actual,
      forecast: indicator.forecast,
      previous: indicator.previous,
      hasNotification: true,
    }));
    const earnings = earningsNotifications.map(({ earnings }) => ({
      id: earnings.id,
      company: {
        id: earnings.company.id,
        ticker: earnings.company.ticker,
        name: earnings.company.name,
      },
      country: earnings.country,
      releaseDate: Number(earnings.releaseDate),
      releaseTiming: earnings.releaseTiming,
      actualEPS: earnings.actualEPS,
      forecastEPS: earnings.forecastEPS,
      previousEPS: earnings.previousEPS,
      actualRevenue: earnings.actualRevenue,
      forecastRevenue: earnings.forecastRevenue,
      previousRevenue: earnings.previousRevenue,
      hasNotification: true,
    }));
    return { economicIndicators, earnings };
  }
}
