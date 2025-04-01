import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto,
  NotificationResponseDto,
  UpdateUserNotificationSettingsDto,
  UpdateNotificationSettingsDto,
} from './dto/notification.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ notifications: NotificationResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      notifications,
      total,
    };
  }

  async getUnreadNotificationsCount(
    userId: number,
  ): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return { count };
  }

  async createNotification(
    userId: number,
    createNotificationDto: CreateNotificationDto,
  ): Promise<{ message: string }> {
    const { type, contentId } = createNotificationDto;

    // 컨텐츠 ID가 실제로 존재하는지 확인
    await this.validateContentExists(type, contentId);

    await this.prisma.notification.create({
      data: {
        userId,
        type,
        contentId,
        read: false,
      },
    });

    return { message: '알림이 성공적으로 생성되었습니다.' };
  }

  async markAsRead(
    userId: number,
    notificationId: number,
  ): Promise<{ message: string }> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return { message: '알림이 읽음으로 표시되었습니다.' };
  }

  async markAllAsRead(
    userId: number,
  ): Promise<{ message: string; count: number }> {
    const { count } = await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return {
      message: '모든 알림이 읽음으로 표시되었습니다.',
      count,
    };
  }

  async deleteNotification(
    userId: number,
    notificationId: number,
  ): Promise<{ message: string }> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('이 알림에 대한 접근 권한이 없습니다.');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: '알림이 성공적으로 삭제되었습니다.' };
  }

  // 알림 대상 컨텐츠가 실제로 존재하는지 확인하는 헬퍼 메서드
  private async validateContentExists(
    type: NotificationType,
    contentId: number,
  ): Promise<void> {
    try {
      switch (type) {
        case NotificationType.EARNINGS:
          const earnings = await this.prisma.earnings.findUnique({
            where: { id: contentId },
          });
          if (!earnings) {
            throw new NotFoundException('해당 실적 발표를 찾을 수 없습니다.');
          }
          break;

        case NotificationType.DIVIDEND:
          const dividend = await this.prisma.dividend.findUnique({
            where: { id: contentId },
          });
          if (!dividend) {
            throw new NotFoundException('해당 배당 이벤트를 찾을 수 없습니다.');
          }
          break;

        case NotificationType.ECONOMIC_INDICATOR:
          const indicator = await this.prisma.economicIndicator.findUnique({
            where: { id: contentId },
          });
          if (!indicator) {
            throw new NotFoundException('해당 경제 지표를 찾을 수 없습니다.');
          }
          break;

        default:
          throw new BadRequestException('유효하지 않은 알림 유형입니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('알림 대상 확인 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자의 알림 설정 조회
   */
  async getUserNotificationSettings(userId: number) {
    // 사용자의 알림 설정 조회
    const settings = await this.prisma.userNotificationSettings.findUnique({
      where: {
        userId,
      },
    });

    // 설정이 없는 경우 기본 설정 생성 후 반환
    if (!settings) {
      return this.prisma.userNotificationSettings.create({
        data: {
          userId,
          emailEnabled: true,
          pushEnabled: true,
          preferredMethod: 'BOTH',
          defaultTiming: 'ONE_DAY_BEFORE',
        },
      });
    }

    return settings;
  }

  /**
   * 사용자의 알림 설정 업데이트
   */
  async updateUserNotificationSettings(
    userId: number,
    updateSettingsDto: UpdateUserNotificationSettingsDto,
  ) {
    const currentSettings = await this.getUserNotificationSettings(userId);

    return this.prisma.userNotificationSettings.update({
      where: {
        id: currentSettings.id,
      },
      data: {
        ...updateSettingsDto,
      },
    });
  }

  /**
   * 특정 알림의 설정 업데이트
   */
  async updateNotificationSettings(
    userId: number,
    notificationId: number,
    updateSettingsDto: UpdateNotificationSettingsDto,
  ) {
    // 알림이 해당 사용자의 것인지 확인
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    // 알림 설정 업데이트
    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        method: updateSettingsDto.method,
        timing: updateSettingsDto.timing,
      },
    });
  }
}
