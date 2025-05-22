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
      const favoriteIndicators = await this.prisma.favoriteIndicator.findMany({
        where: { userId },
      });

      const indicatorNotifications =
        await this.prisma.indicatorNotification.findMany({
          where: { userId },
        });

      const favoriteIndicatorIds = new Set(
        favoriteIndicators.map((f) => f.indicatorId),
      );

      const notificationIds = new Set(
        indicatorNotifications.map((s) => s.indicatorId),
      );

      processedItems.forEach((indicator) => {
        indicator.isFavorite = favoriteIndicatorIds.has(indicator.id);
        indicator.hasNotification = notificationIds.has(indicator.id);
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
