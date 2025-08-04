import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(data: {
    userId: number;
    contentType: ContentType;
    contentId: number;
    notificationType: NotificationType;
    isRead: boolean;
  }) {
    return await this.prisma.notification.create({ data });
  }

  async findNotificationById(id: number) {
    return await this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async findUserNotifications(userId: number, skip: number, take: number) {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countUserNotifications(userId: number) {
    return await this.prisma.notification.count({ where: { userId } });
  }

  async countUnreadNotifications(userId: number) {
    return await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markNotificationAsRead(id: number) {
    return await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllUserNotificationsAsRead(userId: number) {
    return await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async deleteNotification(id: number) {
    return await this.prisma.notification.delete({
      where: { id },
    });
  }

  async deleteAllUserNotifications(userId: number) {
    return await this.prisma.notification.deleteMany({
      where: { userId },
    });
  }

  // 구독 정보 조회 메서드들
  async findEarningsById(id: number) {
    return await this.prisma.earnings.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  async findDividendById(id: number) {
    return await this.prisma.dividend.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  async findEconomicIndicatorById(id: number) {
    return await this.prisma.economicIndicator.findUnique({
      where: { id },
    });
  }

  async findCompanySubscription(userId: number, companyId: number) {
    return await this.prisma.subscriptionCompany.findFirst({
      where: { userId, companyId, isActive: true },
      include: { user: true },
    });
  }

  async findIndicatorGroupSubscription(
    userId: number,
    baseName: string,
    country: string,
  ) {
    return await this.prisma.subscriptionIndicatorGroup.findFirst({
      where: {
        userId,
        baseName,
        country,
        isActive: true,
      },
      include: { user: true },
    });
  }

  // 사용자 알림 설정 메서드들
  async findUserNotificationSettings(userId: number) {
    return await this.prisma.userNotificationSettings.findUnique({
      where: { userId },
    });
  }

  async createUserNotificationSettings(data: {
    userId: number;
    emailEnabled: boolean;
    slackEnabled: boolean;
    slackWebhookUrl: string | null;
    discordEnabled: boolean;
    discordWebhookUrl: string | null;
    notificationsEnabled: boolean;
  }) {
    return await this.prisma.userNotificationSettings.create({ data });
  }

  async upsertUserNotificationSettings(
    userId: number,
    updateData: {
      emailEnabled?: boolean;
      slackEnabled?: boolean;
      slackWebhookUrl?: string;
      discordEnabled?: boolean;
      discordWebhookUrl?: string;
      notificationsEnabled?: boolean;
    },
    createData: {
      userId: number;
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
      discordEnabled: boolean;
      discordWebhookUrl?: string;
      notificationsEnabled: boolean;
    },
  ) {
    return await this.prisma.userNotificationSettings.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
  }

  // 컨텐츠 배치 조회 메서드들
  async findEarningsByIds(ids: number[]) {
    if (ids.length === 0) return [];
    return await this.prisma.earnings.findMany({
      where: { id: { in: ids } },
      include: { company: true },
    });
  }

  async findDividendsByIds(ids: number[]) {
    if (ids.length === 0) return [];
    return await this.prisma.dividend.findMany({
      where: { id: { in: ids } },
      include: { company: true },
    });
  }

  async findEconomicIndicatorsByIds(ids: number[]) {
    if (ids.length === 0) return [];
    return await this.prisma.economicIndicator.findMany({
      where: { id: { in: ids } },
    });
  }
}
