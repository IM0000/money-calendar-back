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
      isFavorite: false,
      hasSubscription: false,
    }));

    if (userId) {
      // 회사 단위 즐겨찾기 정보 조회
      const favoriteCompanies = await this.prisma.favoriteCompany.findMany({
        where: {
          userId,
          companyId: { in: items.map((c) => c.id) },
          isActive: true,
        },
        select: { companyId: true },
      });

      // 회사 단위 구독 정보 조회
      const subscriptionCompanies =
        await this.prisma.subscriptionCompany.findMany({
          where: {
            userId,
            companyId: { in: items.map((c) => c.id) },
            isActive: true,
          },
          select: { companyId: true },
        });

      const favoriteCompanyIds = new Set(
        favoriteCompanies.map((f) => f.companyId),
      );

      const subscriptionCompanyIds = new Set(
        subscriptionCompanies.map((s) => s.companyId),
      );

      itemsWithFavorites.forEach((c) => {
        c.isFavorite = favoriteCompanyIds.has(c.id);
        c.hasSubscription = subscriptionCompanyIds.has(c.id);
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
      // 지표 그룹 단위 즐겨찾기 정보 조회
      const favoriteIndicatorGroups =
        await this.prisma.favoriteIndicatorGroup.findMany({
          where: {
            userId,
            isActive: true,
          },
          select: { baseName: true, country: true },
        });

      // 지표 그룹 단위 구독 정보 조회
      const subscriptionIndicatorGroups =
        await this.prisma.subscriptionIndicatorGroup.findMany({
          where: {
            userId,
            isActive: true,
          },
          select: { baseName: true, country: true },
        });

      // baseName과 country 조합 세트 생성 (즐겨찾기)
      const favoriteBaseNameCountryCombinations = new Set(
        favoriteIndicatorGroups.map((f) => `${f.baseName}:${f.country}`),
      );

      // baseName과 country 조합 세트 생성 (구독)
      const subscriptionBaseNameCountryCombinations = new Set(
        subscriptionIndicatorGroups.map((s) => `${s.baseName}:${s.country}`),
      );

      // 각 지표에 즐겨찾기 및 구독 정보 추가
      processedItems.forEach((indicator) => {
        // baseName+country 조합으로 즐겨찾기 여부 확인
        const favoriteKey = `${indicator.baseName}:${indicator.country}`;
        indicator.isFavorite =
          favoriteBaseNameCountryCombinations.has(favoriteKey);

        // baseName+country 조합으로 구독 여부 확인
        indicator.hasNotification =
          subscriptionBaseNameCountryCombinations.has(favoriteKey);
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
