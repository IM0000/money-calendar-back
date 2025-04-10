import {
  convertDividendBigInt,
  convertEarningsBigInt,
} from './../utils/convert-bigint';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';

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
    let userFavorites = [];
    let userNotifications = [];

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

      // 알림 설정 정보도 조회
      userNotifications = await this.prisma.notification.findMany({
        where: {
          userId,
          contentType: ContentType.EARNINGS,
          contentId: {
            in: earningsItems.map((item) => item.id),
          },
          read: false,
        },
        select: {
          contentId: true,
        },
      });
    }

    // 즐겨찾기와 알림 정보 추가
    const favoriteEarningsIds = new Set(
      userFavorites.map((fav) => fav.earningsId),
    );
    const notificationEarningsIds = new Set(
      userNotifications.map((notif) => notif.contentId),
    );

    const items = convertEarningsBigInt(
      earningsItems.map((item) => ({
        ...item,
        isFavorite: favoriteEarningsIds.has(item.id),
        hasNotification: notificationEarningsIds.has(item.id),
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
    let userFavorites = [];
    let userNotifications = [];

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

      // 알림 설정 정보도 조회 (NotificationSetting 테이블이 있다고 가정)
      userNotifications = await this.prisma.notification.findMany({
        where: {
          userId,
          contentType: ContentType.DIVIDEND,
          contentId: {
            in: dividendItems.map((item) => item.id),
          },
          read: false,
        },
        select: {
          contentId: true,
        },
      });
    }

    // 즐겨찾기와 알림 정보 추가
    const favoriteDividendIds = new Set(
      userFavorites.map((fav) => fav.dividendId),
    );
    const notificationDividendIds = new Set(
      userNotifications.map((notif) => notif.contentId),
    );

    const items = convertDividendBigInt(
      dividendItems.map((item) => ({
        ...item,
        isFavorite: favoriteDividendIds.has(item.id),
        hasNotification: notificationDividendIds.has(item.id),
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
