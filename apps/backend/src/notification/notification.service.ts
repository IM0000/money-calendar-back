import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';
import {
  UpdateUserNotificationSettingsDto,
  NotificationChannel,
  NotificationStatus,
} from './dto/notification.dto';
import { Subject } from 'rxjs';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { EmailService } from '../email/email.service';
import { SlackService } from '../slack/slack.service';

@Injectable()
export class NotificationService {
  private readonly notificationSubject = new Subject<any>();
  public readonly notification$ = this.notificationSubject.asObservable();

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly slackService: SlackService,
  ) {}

  /**
   * 구독 테이블에서 해당 콘텐츠 구독자를 조회
   */
  async findContentSubscriptions(type: ContentType, contentId: number) {
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.subscriptionIndicator.findMany({
          where: {
            indicatorId: contentId,
            isActive: true,
          },
          include: {
            user: {
              include: {
                notificationSettings: true,
              },
            },
          },
        });
      case ContentType.EARNINGS:
        return this.prisma.subscriptionEarnings.findMany({
          where: {
            earningsId: contentId,
            isActive: true,
          },
          include: {
            user: {
              include: {
                notificationSettings: true,
              },
            },
          },
        });
      default:
        throw new NotFoundException({
          errorCode: ERROR_CODE_MAP.RESOURCE_001,
          errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
        });
    }
  }

  /**
   * 알림 생성 및 전송
   */
  async createNotification(dto: {
    contentType: ContentType;
    contentId: number;
    userId: number;
    metadata?: any;
  }) {
    const { contentType, contentId, userId, metadata } = dto;

    // 1. 콘텐츠 정보 조회
    let content: any;
    let subscription: any;

    if (contentType === ContentType.EARNINGS) {
      content = await this.prisma.earnings.findUnique({
        where: { id: contentId },
        include: { company: true },
      });

      if (!content) {
        throw new NotFoundException({
          errorCode: ERROR_CODE_MAP.RESOURCE_001,
          errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
        });
      }

      subscription = await this.prisma.subscriptionEarnings.findFirst({
        where: {
          userId,
          OR: [{ earningsId: contentId }, { companyId: content.companyId }],
          isActive: true,
        },
        include: {
          user: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });
    } else if (contentType === ContentType.ECONOMIC_INDICATOR) {
      content = await this.prisma.economicIndicator.findUnique({
        where: { id: contentId },
      });

      if (!content) {
        throw new NotFoundException({
          errorCode: ERROR_CODE_MAP.RESOURCE_001,
          errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
        });
      }

      const contentBaseName = content.baseName;

      subscription = await this.prisma.subscriptionIndicator.findFirst({
        where: {
          userId,
          OR: [
            { indicatorId: contentId },
            {
              baseName: contentBaseName,
              country: content.country,
            },
          ],
          isActive: true,
        },
        include: {
          user: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });
    } else {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    if (!subscription) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 2. 통합 알림 생성
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        contentType,
        contentId,
        isRead: false,
      },
    });

    // 3. 사용자 알림 설정 조회
    const settings = await this.getUserNotificationSettings(userId);

    // 4. 이메일 전송
    if (settings.emailEnabled && metadata) {
      let subject = '';
      let emailContent = '';

      if (contentType === ContentType.EARNINGS) {
        const { before, after } = metadata;
        subject = `${before.company.name} 실적 업데이트 알림`;
        emailContent = `${before.company.name}의 실적이 업데이트되었습니다. EPS: ${after.actualEPS}, 매출: ${after.actualRevenue}`;
      } else if (contentType === ContentType.ECONOMIC_INDICATOR) {
        const { before, after } = metadata;
        subject = `${before.name} 지표 업데이트 알림`;
        emailContent = `${before.name} 지표가 ${after.actual}로 업데이트되었습니다.`;
      }

      try {
        await this.emailService.sendNotificationEmail({
          email: subscription.user.email,
          subject,
          content: emailContent,
        });

        // 전송 성공 기록
        await this.prisma.notificationDelivery.create({
          data: {
            notificationId: notification.id,
            channelKey: NotificationChannel.EMAIL,
            status: NotificationStatus.SENT,
            deliveredAt: new Date(),
          },
        });
      } catch (error) {
        // 전송 실패 기록
        await this.prisma.notificationDelivery.create({
          data: {
            notificationId: notification.id,
            channelKey: NotificationChannel.EMAIL,
            status: NotificationStatus.FAILED,
            errorMessage: error.message,
          },
        });
      }
    }

    // 5. 슬랙 전송
    if (settings.slackEnabled && settings.slackWebhookUrl) {
      try {
        let title = '';
        let content = '';

        if (contentType === ContentType.EARNINGS) {
          const { before, after } = metadata;
          title = `${before.company.name} 실적 업데이트 알림`;
          content = `${before.company.name}의 실적이 업데이트되었습니다.\nEPS: ${after.actualEPS}\n매출: ${after.actualRevenue}`;
        } else if (contentType === ContentType.ECONOMIC_INDICATOR) {
          const { before, after } = metadata;
          title = `${before.name} 지표 업데이트 알림`;
          content = `${before.name} 지표가 ${after.actual}로 업데이트되었습니다.`;
        }

        await this.slackService.sendNotificationMessage({
          userId,
          text: title,
          blocks: this.slackService.createNotificationBlocks(title, content),
        });

        // 전송 성공 기록
        await this.prisma.notificationDelivery.create({
          data: {
            notificationId: notification.id,
            channelKey: NotificationChannel.SLACK,
            status: NotificationStatus.SENT,
            deliveredAt: new Date(),
          },
        });
      } catch (error) {
        // 전송 실패 기록
        await this.prisma.notificationDelivery.create({
          data: {
            notificationId: notification.id,
            channelKey: NotificationChannel.SLACK,
            status: NotificationStatus.FAILED,
            errorMessage: error.message,
          },
        });
      }
    }

    // 6. 알림 이벤트 발행
    this.notificationSubject.next(notification);

    return notification;
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

    // 설정이 없으면 기본값으로 생성
    return this.prisma.userNotificationSettings.create({
      data: {
        userId,
        emailEnabled: false,
        slackEnabled: false,
        slackWebhookUrl: null,
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
    const { emailEnabled, slackEnabled, webhookUrl } = dto;

    return this.prisma.userNotificationSettings.upsert({
      where: { userId },
      update: {
        ...(emailEnabled !== undefined && { emailEnabled }),
        ...(slackEnabled !== undefined && { slackEnabled }),
        ...(webhookUrl !== undefined && { slackWebhookUrl: webhookUrl }),
      },
      create: {
        userId,
        emailEnabled: emailEnabled ?? false,
        slackEnabled: slackEnabled ?? false,
        slackWebhookUrl: webhookUrl,
      },
    });
  }

  /**
   * 콘텐츠 구독
   */
  async subscribeContent(userId: number, type: ContentType, contentId: number) {
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.subscriptionIndicator.upsert({
          where: {
            userId_indicatorId: {
              userId,
              indicatorId: contentId,
            },
          },
          update: { isActive: true },
          create: {
            userId,
            indicatorId: contentId,
            isActive: true,
          },
        });
      case ContentType.EARNINGS:
        return this.prisma.subscriptionEarnings.upsert({
          where: {
            userId_earningsId: {
              userId,
              earningsId: contentId,
            },
          },
          update: { isActive: true },
          create: {
            userId,
            earningsId: contentId,
            isActive: true,
          },
        });
      default:
        throw new NotFoundException({
          errorCode: ERROR_CODE_MAP.RESOURCE_001,
          errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
        });
    }
  }

  /**
   * 특정 기업의 모든 실적 구독
   */
  async subscribeCompanyEarnings(userId: number, companyId: number) {
    // 1. 기업 존재 여부 확인
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 2. 기업 구독 생성 또는 업데이트
    return this.prisma.subscriptionEarnings.upsert({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      update: { isActive: true },
      create: {
        userId,
        companyId,
        isActive: true,
      },
    });
  }

  /**
   * 특정 국가의 특정 경제지표 유형 모두 구독
   */
  async subscribeIndicatorType(
    userId: number,
    baseName: string,
    country: string,
  ) {
    // 1. 해당 국가에 해당 유형의 지표가 존재하는지 확인
    const indicatorExists = await this.prisma.economicIndicator.findFirst({
      where: {
        baseName,
        country,
      },
    });

    if (!indicatorExists) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: `${country} 국가의 ${baseName} 지표를 찾을 수 없습니다.`,
      });
    }

    // 2. 지표 유형 구독 생성 또는 업데이트
    return this.prisma.subscriptionIndicator.upsert({
      where: {
        userId_baseName_country: {
          userId,
          baseName,
          country,
        },
      },
      update: { isActive: true },
      create: {
        userId,
        baseName,
        country,
        isActive: true,
      },
    });
  }

  /**
   * 콘텐츠 구독 해제 (soft delete)
   */
  async unsubscribeContent(
    userId: number,
    type: ContentType,
    contentId: number,
  ) {
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.subscriptionIndicator.update({
          where: {
            userId_indicatorId: {
              userId,
              indicatorId: contentId,
            },
          },
          data: { isActive: false },
        });
      case ContentType.EARNINGS:
        return this.prisma.subscriptionEarnings.update({
          where: {
            userId_earningsId: {
              userId,
              earningsId: contentId,
            },
          },
          data: { isActive: false },
        });
      default:
        throw new NotFoundException({
          errorCode: ERROR_CODE_MAP.RESOURCE_001,
          errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
        });
    }
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
    const indicatorIds: number[] = [];
    for (const n of notifications) {
      if (n.contentType === ContentType.EARNINGS) {
        earningsIds.push(n.contentId);
      } else if (n.contentType === ContentType.ECONOMIC_INDICATOR) {
        indicatorIds.push(n.contentId);
      }
    }

    // 3) 실제 Earnings / EconomicIndicator 데이터를 각각 한 번씩만 조회
    const [earningsMap, indicatorMap] = await Promise.all([
      (async () => {
        if (earningsIds.length === 0) return {};
        const earningsList = await this.prisma.earnings.findMany({
          where: { id: { in: earningsIds } },
          include: { company: true }, // 필요에 따라 include
        });
        return Object.fromEntries(earningsList.map((e) => [e.id, e]));
      })(),

      (async () => {
        if (indicatorIds.length === 0) return {};
        const indicatorList = await this.prisma.economicIndicator.findMany({
          where: { id: { in: indicatorIds } },
        });
        return Object.fromEntries(indicatorList.map((i) => [i.id, i]));
      })(),
    ]);

    // 4) 원래 Notification 배열 순서대로 매핑
    const enrichedNotifications = notifications.map((n) => {
      let contentDetails = null;

      if (n.contentType === ContentType.EARNINGS) {
        contentDetails = earningsMap[n.contentId];
      } else if (n.contentType === ContentType.ECONOMIC_INDICATOR) {
        contentDetails = indicatorMap[n.contentId];
      }

      return {
        ...n,
        contentDetails,
      };
    });

    // 5) 메타 계산
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
