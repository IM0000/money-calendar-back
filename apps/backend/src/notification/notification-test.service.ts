// src/notification/notification-test.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationTestService {
  constructor(private readonly prisma: PrismaService) {}

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
}
