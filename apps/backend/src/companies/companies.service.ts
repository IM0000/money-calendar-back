import {
  convertDividendBigInt,
  convertEarningsBigInt,
} from './../utils/convert-bigint';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getCompanyEarnings(
    companyId: number,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    const [earningsItems, total] = await Promise.all([
      this.prisma.earnings.findMany({
        where: { companyId },
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' },
      }),
      this.prisma.earnings.count({
        where: { companyId },
      }),
    ]);

    // 사용자 즐겨찾기 정보 조회
    let userFavorites: Array<{ earningsId: number }> = [];
    let userNotifications: Array<{ earningsId: number }> = [];
    let hasCompanySubscription = false;

    if (userId) {
      userFavorites = await this.prisma.favoriteEarnings.findMany({
        where: {
          userId,
          earningsId: {
            in: earningsItems.map((item) => item.id),
          },
        },
        select: {
          earningsId: true,
        },
      });

      // 구독 정보 조회 (개별 실적 구독)
      userNotifications = await this.prisma.subscriptionEarnings.findMany({
        where: {
          userId,
          earningsId: {
            in: earningsItems.map((item) => item.id),
          },
          isActive: true,
        },
        select: {
          earningsId: true,
        },
      });

      // 회사 전체 구독 여부 확인
      const companySubscription =
        await this.prisma.subscriptionEarnings.findFirst({
          where: {
            userId,
            companyId,
            isActive: true,
          },
        });

      hasCompanySubscription = !!companySubscription;
    }

    // 즐겨찾기와 구독 정보 추가
    const favoriteEarningsIds = new Set(
      userFavorites.map((fav) => fav.earningsId),
    );
    const subscriptionEarningsIds = new Set(
      userNotifications.map((notif) => notif.earningsId),
    );

    const items = convertEarningsBigInt(
      earningsItems.map((item) => ({
        ...item,
        isFavorite: favoriteEarningsIds.has(item.id),
        hasNotification:
          subscriptionEarningsIds.has(item.id) || hasCompanySubscription,
      })),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getCompanyDividends(
    companyId: number,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    const [dividendItems, total] = await Promise.all([
      this.prisma.dividend.findMany({
        where: { companyId },
        skip,
        take: limit,
        orderBy: { exDividendDate: 'desc' },
      }),
      this.prisma.dividend.count({
        where: { companyId },
      }),
    ]);

    // 사용자 즐겨찾기 정보 조회
    let userFavorites: Array<{ dividendId: number }> = [];
    // 배당금에 대한 구독 정보는 현재 스키마에서 지원하지 않음

    if (userId) {
      userFavorites = await this.prisma.favoriteDividends.findMany({
        where: {
          userId,
          dividendId: {
            in: dividendItems.map((item) => item.id),
          },
        },
        select: {
          dividendId: true,
        },
      });

      // 배당금에 대한 구독 정보는 현재 스키마에서 지원하지 않음
      // 필요한 경우 SubscriptionDividend 모델을 추가해야 함
    }

    // 즐겨찾기 정보 추가 (구독 정보는 현재 지원하지 않음)
    const favoriteDividendIds = new Set(
      userFavorites.map((fav) => fav.dividendId),
    );
    // 배당금에 대한 구독은 현재 스키마에서 지원하지 않음

    const items = convertDividendBigInt(
      dividendItems.map((item) => ({
        ...item,
        isFavorite: favoriteDividendIds.has(item.id),
        hasNotification: false, // 배당금에 대한 구독은 현재 스키마에서 지원하지 않음
      })),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
