import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationStatus,
  NotificationDelivery,
  NotificationChannel,
} from '@prisma/client';
import { ERROR_CODE_MAP } from '../common/constants/error.constant';

/**
 * NotificationDelivery 관련 데이터베이스 작업을 담당하는 서비스
 */
@Injectable()
export class NotificationDeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ID로 NotificationDelivery 조회
   */
  async findById(id: number): Promise<NotificationDelivery> {
    const delivery = await this.prisma.notificationDelivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: `NotificationDelivery not found: ${id}`,
      });
    }

    return delivery;
  }

  /**
   * 전송 성공 상태로 업데이트
   */
  async updateToSent(id: number, processingTime: number): Promise<void> {
    await this.prisma.notificationDelivery.update({
      where: { id },
      data: {
        status: NotificationStatus.SENT,
        deliveredAt: new Date(),
        lastAttemptAt: new Date(),
        processingTimeMs: processingTime,
        errorMessage: null,
        errorCode: null,
      },
    });
  }

  /**
   * 전송 실패 상태로 업데이트
   */
  async updateToFailed(
    id: number,
    retryCount: number,
    error: Error,
    processingTime: number,
  ): Promise<void> {
    await this.prisma.notificationDelivery.update({
      where: { id },
      data: {
        status: NotificationStatus.FAILED,
        retryCount,
        lastAttemptAt: new Date(),
        processingTimeMs: processingTime,
        errorMessage: error.message,
        errorCode: (error as any).code || error.name || 'UNKNOWN_ERROR',
      },
    });
  }

  /**
   * 재시도 대상 배송 조회 (모니터링용)
   * 현재는 단순히 실패한 배송들을 조회
   */
  async findRetryTargets(): Promise<NotificationDelivery[]> {
    return this.prisma.notificationDelivery.findMany({
      where: {
        status: NotificationStatus.FAILED,
        retryCount: {
          lt: 3, // 최대 3회 재시도
        },
      },
      orderBy: {
        lastAttemptAt: 'asc',
      },
      take: 100, // 한 번에 최대 100개만 조회
    });
  }

  /**
   * 채널별 전송 통계 조회 (모니터링용)
   */
  async getDeliveryStats(channelKey: NotificationChannel, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const totalCount = await this.prisma.notificationDelivery.count({
      where: {
        channelKey,
        createdAt: {
          gte: since,
        },
      },
    });

    const sentCount = await this.prisma.notificationDelivery.count({
      where: {
        channelKey,
        status: NotificationStatus.SENT,
        createdAt: {
          gte: since,
        },
      },
    });

    const failedCount = await this.prisma.notificationDelivery.count({
      where: {
        channelKey,
        status: NotificationStatus.FAILED,
        createdAt: {
          gte: since,
        },
      },
    });

    const avgProcessingTime = await this.prisma.notificationDelivery.aggregate({
      where: {
        channelKey,
        createdAt: {
          gte: since,
        },
        processingTimeMs: {
          not: null,
        },
      },
      _avg: {
        processingTimeMs: true,
      },
    });

    return {
      total: totalCount,
      sent: sentCount,
      failed: failedCount,
      successRate: totalCount > 0 ? (sentCount / totalCount) * 100 : 0,
      avgProcessingTimeMs: avgProcessingTime._avg.processingTimeMs || 0,
    };
  }
}
