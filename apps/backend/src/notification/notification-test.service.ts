// src/notification/notification-test.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationScheduler } from './notification.scheduler';

@Injectable()
export class NotificationTestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dividendScheduler: NotificationScheduler,
  ) {}

  /**
   * 테스트용 경제지표 actual 변경
   */
  async testIndicatorActual(
    indicatorId: number,
  ): Promise<{ success: boolean }> {
    const indicator = await this.prisma.economicIndicator.findUnique({
      where: { id: indicatorId },
    });
    if (!indicator)
      throw new NotFoundException('해당 경제지표를 찾을 수 없습니다.');
    // 임의 테스트 값 설정 (타임스탬프 문자열)
    await this.prisma.economicIndicator.update({
      where: { id: indicatorId },
      data: { actual: `${Date.now()}` },
    });
    return { success: true };
  }

  /**
   * 경제지표 actual 원상복구 (빈 문자열)
   */
  async restoreIndicatorActual(
    indicatorId: number,
  ): Promise<{ success: boolean }> {
    const indicator = await this.prisma.economicIndicator.findUnique({
      where: { id: indicatorId },
    });
    if (!indicator)
      throw new NotFoundException('해당 경제지표를 찾을 수 없습니다.');
    await this.prisma.economicIndicator.update({
      where: { id: indicatorId },
      data: { actual: '' },
    });
    return { success: true };
  }

  /**
   * 테스트용 Earnings actualEPS 변경
   */
  async testEarningsActual(earningsId: number): Promise<{ success: boolean }> {
    const earnings = await this.prisma.earnings.findUnique({
      where: { id: earningsId },
    });
    if (!earnings) throw new NotFoundException('해당 실적을 찾을 수 없습니다.');
    await this.prisma.earnings.update({
      where: { id: earningsId },
      data: { actualEPS: `${Date.now()}` },
    });
    return { success: true };
  }

  /**
   * Earnings actualEPS 원상복구 (빈 문자열)
   */
  async restoreEarningsActual(
    earningsId: number,
  ): Promise<{ success: boolean }> {
    const earnings = await this.prisma.earnings.findUnique({
      where: { id: earningsId },
    });
    if (!earnings) throw new NotFoundException('해당 실적을 찾을 수 없습니다.');
    await this.prisma.earnings.update({
      where: { id: earningsId },
      data: { actualEPS: '--' },
    });
    return { success: true };
  }

  /**
   * 테스트용 배당 데이터 변경
   */
  async testDividendData(dividendId: number): Promise<{ success: boolean }> {
    const dividend = await this.prisma.dividend.findUnique({
      where: { id: dividendId },
    });
    if (!dividend) throw new NotFoundException('해당 배당을 찾을 수 없습니다.');

    // 배당금과 배당수익률을 테스트 값으로 변경
    const testDividendAmount = `${(Math.random() * 10 + 1).toFixed(2)}`;
    const testDividendYield = `${(Math.random() * 5 + 1).toFixed(2)}%`;

    await this.prisma.dividend.update({
      where: { id: dividendId },
      data: {
        dividendAmount: testDividendAmount,
        dividendYield: testDividendYield,
      },
    });
    return { success: true };
  }

  /**
   * 배당 데이터 원상복구
   */
  async restoreDividendData(dividendId: number): Promise<{ success: boolean }> {
    const dividend = await this.prisma.dividend.findUnique({
      where: { id: dividendId },
    });
    if (!dividend) throw new NotFoundException('해당 배당을 찾을 수 없습니다.');

    await this.prisma.dividend.update({
      where: { id: dividendId },
      data: {
        dividendAmount: '--',
        dividendYield: '--',
      },
    });
    return { success: true };
  }

  /**
   * 배당 지급일 알림 테스트 (스케줄러 수동 실행)
   */
  async testDividendPayment(): Promise<{ message: string }> {
    await this.dividendScheduler.testDividendNotification();
    return { message: '배당 지급일 알림 테스트가 실행되었습니다.' };
  }
}
