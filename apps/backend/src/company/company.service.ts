import {
  convertDividendBigInt,
  convertEarningsBigInt,
} from '../common/utils/convert-bigint';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
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

    let isFavoriteCompany = false;
    let hasCompanySubscription = false;

    if (userId) {
      const favoriteCompany = await this.prisma.favoriteCompany.findUnique({
        where: {
          userId_companyId: { userId, companyId },
        },
      });
      isFavoriteCompany = favoriteCompany?.isActive ?? false;

      const companySubscription =
        await this.prisma.subscriptionCompany.findUnique({
          where: {
            userId_companyId: { userId, companyId },
          },
        });
      hasCompanySubscription = companySubscription?.isActive ?? false;
    }

    const items = convertEarningsBigInt(
      earningsItems.map((item) => ({
        ...item,
        isFavorite: isFavoriteCompany,
        hasNotification: hasCompanySubscription,
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

    let isFavoriteCompany = false;
    let hasCompanySubscription = false;

    if (userId) {
      const favoriteCompany = await this.prisma.favoriteCompany.findUnique({
        where: {
          userId_companyId: { userId, companyId },
        },
      });
      isFavoriteCompany = favoriteCompany?.isActive ?? false;

      const companySubscription =
        await this.prisma.subscriptionCompany.findUnique({
          where: {
            userId_companyId: { userId, companyId },
          },
        });
      hasCompanySubscription = companySubscription?.isActive ?? false;
    }

    const items = convertDividendBigInt(
      dividendItems.map((item) => ({
        ...item,
        isFavorite: isFavoriteCompany,
        hasNotification: hasCompanySubscription,
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
