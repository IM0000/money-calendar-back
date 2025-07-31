import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// Prisma 생성 타입 사용 및 export
export type EarningsWithCompany = Prisma.EarningsGetPayload<{
  include: { company: true };
}>;

export type DividendWithCompany = Prisma.DividendGetPayload<{
  include: { company: true };
}>;

export type EconomicIndicatorData = Prisma.EconomicIndicatorGetPayload<null>;

export interface PaginatedEarnings {
  items: EarningsWithCompany[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedDividends {
  items: DividendWithCompany[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedIndicators {
  items: EconomicIndicatorData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserFavoriteData {
  favoriteCompanyIds: number[];
  subscribedCompanyIds: number[];
  favoriteIndicatorGroups: { baseName: string; country: string }[];
  subscribedIndicatorGroups: { baseName: string; country: string }[];
}

@Injectable()
export class CalendarRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 기간의 실적 데이터 조회 (회사 정보 포함)
   */
  async findEarningsByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<EarningsWithCompany[]> {
    return await this.prisma.earnings.findMany({
      where: {
        releaseDate: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      include: {
        company: true,
      },
      orderBy: {
        releaseDate: 'asc',
      },
    });
  }

  /**
   * 특정 회사들의 실적 데이터 조회 (특정 기간)
   */
  async findEarningsByCompanyIds(
    companyIds: number[],
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<EarningsWithCompany[]> {
    if (companyIds.length === 0) return [];

    return await this.prisma.earnings.findMany({
      where: {
        companyId: { in: companyIds },
        releaseDate: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      include: { company: true },
      orderBy: { releaseDate: 'asc' },
    });
  }

  /**
   * 특정 기간의 배당 데이터 조회 (회사 정보 포함)
   */
  async findDividendsByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<DividendWithCompany[]> {
    return await this.prisma.dividend.findMany({
      where: {
        exDividendDate: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      include: {
        company: true,
      },
      orderBy: {
        exDividendDate: 'asc',
      },
    });
  }

  /**
   * 특정 회사들의 배당 데이터 조회 (특정 기간)
   */
  async findDividendsByCompanyIds(
    companyIds: number[],
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<DividendWithCompany[]> {
    if (companyIds.length === 0) return [];

    return await this.prisma.dividend.findMany({
      where: {
        companyId: { in: companyIds },
        exDividendDate: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      include: { company: true },
      orderBy: { exDividendDate: 'asc' },
    });
  }

  /**
   * 특정 기간의 경제지표 데이터 조회
   */
  async findEconomicIndicatorsByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<EconomicIndicatorData[]> {
    return await this.prisma.economicIndicator.findMany({
      where: {
        releaseDate: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      orderBy: {
        releaseDate: 'asc',
      },
    });
  }

  /**
   * 특정 지표 그룹들의 경제지표 데이터 조회 (특정 기간)
   */
  async findEconomicIndicatorsByGroups(
    indicatorGroups: { baseName: string; country: string }[],
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<EconomicIndicatorData[]> {
    if (indicatorGroups.length === 0) return [];

    return await this.prisma.economicIndicator.findMany({
      where: {
        OR: indicatorGroups.map((group) => ({
          baseName: group.baseName,
          country: group.country,
        })),
        releaseDate: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      orderBy: { releaseDate: 'asc' },
    });
  }

  /**
   * 사용자의 관심/구독 정보 조회
   */
  async findUserFavoriteData(userId: number): Promise<UserFavoriteData> {
    const [
      favoriteCompanies,
      subscribedCompanies,
      favoriteIndicatorGroups,
      subscribedIndicatorGroups,
    ] = await Promise.all([
      this.prisma.favoriteCompany.findMany({
        where: { userId, isActive: true },
        select: { companyId: true },
      }),
      this.prisma.subscriptionCompany.findMany({
        where: { userId, isActive: true },
        select: { companyId: true },
      }),
      this.prisma.favoriteIndicatorGroup.findMany({
        where: { userId, isActive: true },
        select: { baseName: true, country: true },
      }),
      this.prisma.subscriptionIndicatorGroup.findMany({
        where: { userId, isActive: true },
        select: { baseName: true, country: true },
      }),
    ]);

    return {
      favoriteCompanyIds: favoriteCompanies.map((f) => f.companyId),
      subscribedCompanyIds: subscribedCompanies.map((s) => s.companyId),
      favoriteIndicatorGroups,
      subscribedIndicatorGroups,
    };
  }

  /**
   * 특정 회사의 실적 히스토리 조회 (페이지네이션)
   */
  async findCompanyEarningsHistory(
    companyId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedEarnings> {
    const skip = (page - 1) * limit;

    const [earnings, total] = await Promise.all([
      this.prisma.earnings.findMany({
        where: { companyId },
        include: { company: true },
        orderBy: { releaseDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.earnings.count({
        where: { companyId },
      }),
    ]);

    return {
      items: earnings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 특정 회사의 배당 히스토리 조회 (페이지네이션)
   */
  async findCompanyDividendHistory(
    companyId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedDividends> {
    const skip = (page - 1) * limit;

    const [dividends, total] = await Promise.all([
      this.prisma.dividend.findMany({
        where: { companyId },
        include: { company: true },
        orderBy: { exDividendDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.dividend.count({
        where: { companyId },
      }),
    ]);

    return {
      items: dividends,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 특정 지표 그룹(baseName + country)의 경제지표 히스토리 조회 (페이지네이션)
   */
  async findIndicatorGroupHistory(
    baseName: string,
    country: string | undefined,
    page: number,
    limit: number,
  ): Promise<PaginatedIndicators> {
    const skip = (page - 1) * limit;
    const whereCondition = country ? { baseName, country } : { baseName };

    const [indicators, total] = await Promise.all([
      this.prisma.economicIndicator.findMany({
        where: whereCondition,
        orderBy: { releaseDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.economicIndicator.count({
        where: whereCondition,
      }),
    ]);

    return {
      items: indicators,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 특정 회사의 즐겨찾기/구독 여부 확인
   */
  async checkCompanyFavoriteAndSubscription(
    userId: number,
    companyId: number,
  ): Promise<{ isFavorite: boolean; isSubscribed: boolean }> {
    const [favoriteCheck, subscriptionCheck] = await Promise.all([
      this.prisma.favoriteCompany.findFirst({
        where: { userId, companyId, isActive: true },
      }),
      this.prisma.subscriptionCompany.findFirst({
        where: { userId, companyId, isActive: true },
      }),
    ]);

    return {
      isFavorite: !!favoriteCheck,
      isSubscribed: !!subscriptionCheck,
    };
  }

  /**
   * 특정 지표 그룹의 즐겨찾기/구독 여부 확인
   */
  async checkIndicatorGroupFavoriteAndSubscription(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<{ isFavorite: boolean; isSubscribed: boolean }> {
    const [favoriteCheck, subscriptionCheck] = await Promise.all([
      this.prisma.favoriteIndicatorGroup.findFirst({
        where: { userId, baseName, country, isActive: true },
      }),
      this.prisma.subscriptionIndicatorGroup.findFirst({
        where: { userId, baseName, country, isActive: true },
      }),
    ]);

    return {
      isFavorite: !!favoriteCheck,
      isSubscribed: !!subscriptionCheck,
    };
  }
}
