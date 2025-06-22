import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { ContentType, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * 매일 오전 9시에 실행되는 배당 지급일 알림 스케줄러
   * 오늘 배당 지급일인 회사들을 찾아서 구독자들에게 알림 발송
   */
  @Cron('0 9 * * *', {
    name: 'dividend-payment-notification',
    timeZone: 'Asia/Seoul',
  })
  async sendDividendPaymentNotifications() {
    this.logger.log('배당 지급일 알림 스케줄러 시작');

    try {
      // 오늘 날짜의 시작과 끝 (밀리초)
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

      this.logger.log(
        `오늘 날짜 범위: ${new Date(startOfDay).toISOString()} ~ ${new Date(
          endOfDay,
        ).toISOString()}`,
      );

      // 오늘 배당 지급일인 배당 이벤트들 조회
      const todayDividends = await this.prisma.dividend.findMany({
        where: {
          paymentDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          company: true,
        },
      });

      this.logger.log(`오늘 배당 지급일인 회사 수: ${todayDividends.length}`);

      if (todayDividends.length === 0) {
        this.logger.log('오늘 배당 지급일인 회사가 없습니다.');
        return;
      }

      // 각 배당 이벤트에 대해 구독자들에게 알림 발송
      for (const dividend of todayDividends) {
        await this.sendDividendPaymentNotification(dividend);
      }

      this.logger.log('배당 지급일 알림 스케줄러 완료');
    } catch (error) {
      this.logger.error('배당 지급일 알림 스케줄러 실행 중 오류 발생:', error);
    }
  }

  /**
   * 특정 배당 이벤트에 대해 구독자들에게 알림 발송
   */
  private async sendDividendPaymentNotification(dividend: any) {
    try {
      // 해당 회사를 구독한 사용자들 조회
      const subscribers = await this.prisma.subscriptionCompany.findMany({
        where: {
          companyId: dividend.companyId,
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

      this.logger.log(
        `${dividend.company.name} 배당 지급일 알림 - 구독자 수: ${subscribers.length}`,
      );

      if (subscribers.length === 0) {
        return;
      }

      // 각 구독자에게 알림 생성
      for (const subscription of subscribers) {
        const user = subscription.user;

        // 사용자의 알림 설정 확인
        if (!user.notificationSettings?.notificationsEnabled) {
          this.logger.log(
            `사용자 ${user.id}는 알림이 비활성화되어 있어 건너뜁니다.`,
          );
          continue;
        }

        // 알림 생성
        await this.notificationService.createNotification({
          contentType: ContentType.DIVIDEND,
          contentId: dividend.id,
          userId: user.id,
          notificationType: NotificationType.PAYMENT_DATE,
          currentData: dividend,
        });

        this.logger.log(
          `${dividend.company.name} 배당 지급일 알림을 사용자 ${user.id}에게 발송했습니다.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `${dividend.company.name} 배당 지급일 알림 발송 중 오류:`,
        error,
      );
    }
  }

  /**
   * 테스트용 메서드 - 수동으로 배당 알림 실행
   */
  async testDividendNotification() {
    this.logger.log('테스트용 배당 알림 실행');
    await this.sendDividendPaymentNotifications();
  }
}
