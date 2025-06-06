import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { Prisma, Company } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchCompanies(searchDto: SearchCompanyDto, userId?: number) {
    const { query, country, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const q = `%${query}%`;

    const items = await this.prisma.$queryRaw<Company[]>`
      SELECT *
        FROM "Company"
      WHERE
        (${query} = '' OR "name" ILIKE ${q} OR "ticker"::text ILIKE ${q})
        AND (${country} = '' OR country = ${country})
      ORDER BY
        CASE WHEN "ticker"::text ILIKE ${q} THEN 0 ELSE 1 END,
        "name" ASC
      LIMIT ${limit}
      OFFSET ${skip};
    `;

    const total = await this.prisma.company.count({
      where: {
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { ticker: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(country ? { country } : {}),
      },
    });

    const itemsWithFavorites = items.map((company) => ({
      ...company,
      isFavoriteEarnings: false,
      isFavoriteDividend: false,
    }));

    if (userId) {
      const [favE, favD] = await Promise.all([
        this.prisma.favoriteEarnings.findMany({
          where: { userId },
          include: { earnings: true },
        }),
        this.prisma.favoriteDividends.findMany({
          where: { userId },
          include: { dividend: true },
        }),
      ]);

      const earningsIds = new Set(favE.map((f) => f.earnings.companyId));
      const dividendIds = new Set(favD.map((f) => f.dividend.companyId));

      itemsWithFavorites.forEach((c) => {
        c.isFavoriteEarnings = earningsIds.has(c.id);
        c.isFavoriteDividend = dividendIds.has(c.id);
      });
    }

    return {
      items: itemsWithFavorites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchIndicators(searchDto: SearchIndicatorDto, userId?: number) {
    const { query, country, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const where: Prisma.EconomicIndicatorWhereInput = {
      ...(query
        ? { name: { contains: query, mode: Prisma.QueryMode.insensitive } }
        : {}),
      ...(country ? { country } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.economicIndicator.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ releaseDate: 'desc' }, { name: 'asc' }],
        distinct: ['name', 'country', 'releaseDate'],
      }),
      this.prisma.economicIndicator.count({
        where,
      }),
    ]);

    // BigInt 변환 및 관심 정보 초기화
    const processedItems = items.map((indicator) => ({
      ...indicator,
      releaseDate: indicator.releaseDate ? Number(indicator.releaseDate) : null,
      isFavorite: false,
      hasNotification: false,
    }));

    if (userId) {
      // 즐겨찾기 정보 조회
      const favoriteIndicators = await this.prisma.favoriteIndicator.findMany({
        where: { userId },
      });

      // 구독 정보 조회 (개별 지표 구독)
      const indicatorSubscriptions =
        await this.prisma.subscriptionIndicator.findMany({
          where: {
            userId,
            indicatorId: {
              in: processedItems.map((item) => item.id),
            },
            isActive: true,
          },
        });

      // baseName과 country 기반 구독 정보 조회
      const baseNameCountrySubscriptions =
        await this.prisma.subscriptionIndicator.findMany({
          where: {
            userId,
            baseName: {
              in: [
                ...new Set(processedItems.map((item) => item.baseName)),
              ].filter(Boolean),
            },
            country: {
              in: [
                ...new Set(processedItems.map((item) => item.country)),
              ].filter(Boolean),
            },
            isActive: true,
          },
        });

      // 즐겨찾기 ID 세트 생성
      const favoriteIndicatorIds = new Set(
        favoriteIndicators.map((f) => f.indicatorId),
      );

      // 구독 ID 세트 생성 (개별 지표)
      const subscriptionIds = new Set(
        indicatorSubscriptions.map((s) => s.indicatorId),
      );

      // baseName과 country 조합 세트 생성
      const baseNameCountryCombinations = new Set(
        baseNameCountrySubscriptions.map((s) => `${s.baseName}:${s.country}`),
      );

      // 각 지표에 즐겨찾기 및 구독 정보 추가
      processedItems.forEach((indicator) => {
        indicator.isFavorite = favoriteIndicatorIds.has(indicator.id);

        // 개별 지표 구독 또는 baseName+country 조합 구독 여부 확인
        const hasDirectSubscription = subscriptionIds.has(indicator.id);
        const hasBaseNameCountrySubscription =
          indicator.baseName &&
          indicator.country &&
          baseNameCountryCombinations.has(
            `${indicator.baseName}:${indicator.country}`,
          );

        // 둘 중 하나라도 구독 중이면 hasNotification = true
        indicator.hasNotification =
          hasDirectSubscription || hasBaseNameCountrySubscription;
      });
    }

    return {
      items: processedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
