/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  async getContentSubscribers(type: ContentType, contentId: number) {
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

    // 5. 알림 전송
    if (settings && settings.emailEnabled) {
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
    const { emailEnabled, slackEnabled, slackWebhookUrl } = dto;

    return this.prisma.userNotificationSettings.upsert({
      where: { userId },
      update: {
        ...(emailEnabled !== undefined && { emailEnabled }),
        ...(slackEnabled !== undefined && { slackEnabled }),
        ...(slackWebhookUrl !== undefined && {
          slackWebhookUrl,
        }),
      },
      create: {
        userId,
        emailEnabled: emailEnabled ?? false,
        slackEnabled: slackEnabled ?? false,
        slackWebhookUrl,
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
  async subscribeBaseNameIndicator(
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
    subscriptionId: number,
  ) {
    console.log(userId, type, subscriptionId);
    switch (type) {
      case ContentType.ECONOMIC_INDICATOR:
        return this.prisma.subscriptionIndicator.update({
          where: {
            id: subscriptionId,
          },
          data: { isActive: false },
        });
      case ContentType.EARNINGS:
        return this.prisma.subscriptionEarnings.update({
          where: {
            id: subscriptionId,
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

  /**
   * 특정 기업의 모든 실적 구독 해제
   */
  async unsubscribeCompanyEarnings(userId: number, companyId: number) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 기업 존재 여부 확인
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 1. 해당 기업 구독 해제
    await this.prisma.subscriptionEarnings.updateMany({
      where: {
        userId,
        companyId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // 2. 해당 기업의 모든 실적 구독 해제
    const result = await this.prisma.subscriptionEarnings.updateMany({
      where: {
        userId,
        earnings: {
          companyId,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return {
      message: `${company.name} 기업의 모든 알림이 해제되었습니다.`,
      count: result.count + 1, // 기업 구독 + 실적 구독 개수
    };
  }

  /**
   * 특정 국가의 특정 경제지표 유형 모두 구독 해제
   */
  async unsubscribeBaseNameIndicator(
    userId: number,
    baseName: string,
    country: string,
  ) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 1. 해당 경제지표 유형 구독 해제
    await this.prisma.subscriptionIndicator.updateMany({
      where: {
        userId,
        baseName,
        country,
        indicatorId: null,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // 2. 해당 경제지표 유형에 해당하는 모든 개별 경제지표 구독 해제
    const result = await this.prisma.subscriptionIndicator.updateMany({
      where: {
        userId,
        indicator: {
          baseName,
          country,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return {
      message: `${country} 국가의 ${baseName} 경제지표 유형에 대한 모든 알림이 해제되었습니다.`,
      count: result.count + 1, // 경제지표 유형 구독 + 개별 경제지표 구독 개수
    };
  }

  /**
   * 사용자가 구독한 모든 SubscriptionEarnings와 SubscriptionIndicator 조회
   */
  async getUserSubscriptions(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    // 사용자의 모든 구독 정보를 병렬로 조회
    const [subscriptionEarnings, subscriptionIndicators] = await Promise.all([
      // 1) 실적 구독 정보 조회
      this.prisma.$queryRaw<
        Array<{
          id: number;
          subscribedAt: Date;
          companyId: number | null;
          earningsId: number | null;

          company_id: number | null;
          ticker: string | null;
          name: string | null;
          country: string | null;

          earnings_id: number | null;
          earnings_country: string | null;
          releaseDate: bigint | null;
          releaseTiming: string | null;
          actualEPS: string | null;
          forecastEPS: string | null;
          previousEPS: string | null;
          actualRevenue: string | null;
          forecastRevenue: string | null;
          previousRevenue: string | null;

          c1_id: number | null;
          c1_ticker: string | null;
          c1_name: string | null;
          c1_country: string | null;
        }>
      >`
        SELECT
          se.id                 AS id,
          se."subscribedAt"     AS "subscribedAt",
          se."companyId"        AS "companyId",
          se."earningsId"       AS "earningsId",

          c2.id                 AS c2_id,
          c2.ticker             AS c2_ticker,
          c2.name               AS c2_name,
          c2.country            AS c2_country,

          e.id                   AS earnings_id,
          e.country              AS earnings_country,
          e."releaseDate"        AS "releaseDate",
          e."releaseTiming"      AS "releaseTiming",
          e."actualEPS"          AS "actualEPS",
          e."forecastEPS"        AS "forecastEPS",
          e."previousEPS"        AS "previousEPS",
          e."actualRevenue"      AS "actualRevenue",
          e."forecastRevenue"    AS "forecastRevenue",
          e."previousRevenue"    AS "previousRevenue",

          c1.id                 AS c1_id,
          c1.ticker             AS c1_ticker,
          c1.name               AS c1_name,
          c1.country            AS c1_country
        FROM "SubscriptionEarnings" se
        LEFT JOIN "Company"       c2 
          ON se."companyId" = c2.id
        LEFT JOIN "Earnings"      e 
          ON se."earningsId" = e.id
        LEFT JOIN "Company"  c1
          ON e."companyId"   = c1.id
        WHERE se."userId"   = ${userId}
          AND se."isActive" = true
        `,

      // 2) 경제지표 구독 정보 조회
      this.prisma.$queryRaw<
        Array<{
          id: number;
          subscribedAt: Date;
          indicatorId: number | null;
          baseName: string | null;

          ei_id: number | null;
          ei_name: string | null;
          ei_baseName: string | null;
          country: string | null;
          releaseDate: bigint | null;
          importance: number | null;
          actual: string | null;
          forecast: string | null;
          previous: string | null;
        }>
      >`
        SELECT
          si.id                    AS id,
          si."subscribedAt"        AS "subscribedAt",
          si."indicatorId"         AS "indicatorId",
          si."baseName"            AS "baseName",

          ei.id                    AS ei_id,
          ei.name                  AS ei_name,
          ei."baseName"            AS ei_baseName,
          ei.country               AS country,
          ei."releaseDate"         AS "releaseDate",
          ei.importance            AS importance,
          ei.actual                AS actual,
          ei.forecast              AS forecast,
          ei.previous              AS previous
        FROM "SubscriptionIndicator" si
        LEFT JOIN "EconomicIndicator" ei 
          ON si."indicatorId" = ei.id
        WHERE si."userId"   = ${userId}
          AND si."isActive" = true
        `,
    ]);

    // ② 실적 구독 정보 처리
    const earningsArray = subscriptionEarnings as any[];

    // (a) 기업 전체 실적 구독만 추출
    const companySubscriptions = earningsArray
      .filter((sub) => sub.companyId !== null && sub.earningsId === null)
      .map((sub) => ({
        id: sub.id,
        type: 'company',
        subscribedAt: sub.subscribedAt,
        company: {
          id: sub.c2_id!,
          ticker: sub.c2_ticker!,
          name: sub.c2_name!,
          country: sub.c2_country!,
        },
        earnings: {
          id: sub.earnings_id,
          country: sub.earnings_country,
          releaseDate: sub.releaseDate ? Number(sub.releaseDate) : null,
          releaseTiming: sub.releaseTiming,
          actualEPS: sub.actualEPS,
          forecastEPS: sub.forecastEPS,
          previousEPS: sub.previousEPS,
          actualRevenue: sub.actualRevenue,
          forecastRevenue: sub.forecastRevenue,
          previousRevenue: sub.previousRevenue,
        },
      }));

    // (b) 개별 실적 구독만 추출
    const earningsSubscriptions = earningsArray
      .filter((sub) => sub.earningsId !== null)
      .map((sub) => ({
        id: sub.id,
        type: 'earnings',
        subscribedAt: sub.subscribedAt,
        company: {
          id: sub.c1_id!,
          name: sub.c1_name!,
          ticker: sub.c1_ticker!,
          country: sub.c1_country!,
        },
        earnings: {
          id: sub.earnings_id!,
          country: sub.earnings_country!,
          releaseDate: Number(sub.releaseDate!),
          releaseTiming: sub.releaseTiming,
          actualEPS: sub.actualEPS,
          forecastEPS: sub.forecastEPS,
          previousEPS: sub.previousEPS,
          actualRevenue: sub.actualRevenue,
          forecastRevenue: sub.forecastRevenue,
          previousRevenue: sub.previousRevenue,
        },
      }));

    // ③ 경제지표 구독 정보 처리
    const indicatorsArray = subscriptionIndicators as any[];

    // (a) 이름 기반 전체 구독 (baseName만 있고 indicatorId는 null)
    const baseNameSubscriptions = indicatorsArray
      .filter((sub) => sub.baseName && sub.indicatorId === null)
      .map((sub) => ({
        id: sub.id,
        type: 'baseNameIndicator',
        subscribedAt: sub.subscribedAt,
        indicator: {
          id: sub.ei_id,
          name: sub.ei_name!,
          baseName: sub.ei_baseName!,
          country: sub.country!,
          releaseDate: Number(sub.releaseDate!),
          importance: sub.importance!,
          actual: sub.actual!,
          forecast: sub.forecast!,
          previous: sub.previous!,
        },
      }));

    // (b) 개별 경제지표 구독 (indicatorId가 있을 때)
    const indicatorSubscriptions = indicatorsArray
      .filter((sub) => sub.indicatorId !== null)
      .map((sub) => ({
        id: sub.id,
        type: 'indicator',
        subscribedAt: sub.subscribedAt,
        indicator: {
          id: sub.ei_id!,
          name: sub.ei_name!,
          baseName: sub.ei_baseName!,
          country: sub.country!,
          releaseDate: Number(sub.releaseDate!),
          importance: sub.importance!,
          actual: sub.actual!,
          forecast: sub.forecast!,
          previous: sub.previous!,
        },
      }));

    return {
      earnings: {
        companies: companySubscriptions,
        individual: earningsSubscriptions,
        total: companySubscriptions.length + earningsSubscriptions.length,
      },
      indicators: {
        baseNames: baseNameSubscriptions,
        individual: indicatorSubscriptions,
        total: baseNameSubscriptions.length + indicatorSubscriptions.length,
      },
      totalCount:
        companySubscriptions.length +
        earningsSubscriptions.length +
        baseNameSubscriptions.length +
        indicatorSubscriptions.length,
    };
  }
}
