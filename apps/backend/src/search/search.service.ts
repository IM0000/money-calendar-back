import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { Prisma, Company } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 기업 검색
   */
  async searchCompanies(searchDto: SearchCompanyDto, userId?: number) {
    const { query, country, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    // 검색 조건 Prisma WhereInput
    const where: Prisma.CompanyWhereInput = {
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
              {
                ticker: { contains: query, mode: Prisma.QueryMode.insensitive },
              },
            ],
          }
        : {}),
      ...(country ? { country } : {}),
    };

    // 1) Raw SQL WHERE 절 문자열 생성
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (query) {
      whereClauses.push(
        `("name" ILIKE '%' || $1 || '%' OR "ticker" ILIKE '%' || $1 || '%')`,
      );
      params.push(query);
    }
    if (country) {
      whereClauses.push(`"country" = $${params.length + 1}`);
      params.push(country);
    }
    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : '';

    // 2) Raw SQL로 우선순위 정렬 + 페이징
    // Raw SQL로 정렬 + 페이징
    const items = await this.prisma.$queryRaw<Company[]>`
      SELECT *
        FROM "Company"
        ${whereSQL ? Prisma.raw(whereSQL) : Prisma.empty}
        ORDER BY
          (CASE WHEN "ticker" ILIKE '%' || ${query} || '%' THEN 0 ELSE 1 END),
          "name" ASC
        LIMIT ${limit}
        OFFSET ${skip};
      `;

    // 3) 전체 건수는 기존 count 사용
    const total = await this.prisma.company.count({ where });

    // 4) favorites 매핑
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

  /**
   * 경제지표 검색
   */
  async searchIndicators(searchDto: SearchIndicatorDto, userId?: number) {
    const { query, country, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    // 검색 조건 구성
    const where: Prisma.EconomicIndicatorWhereInput = {
      ...(query
        ? { name: { contains: query, mode: Prisma.QueryMode.insensitive } }
        : {}),
      ...(country ? { country } : {}),
    };

    // 경제지표 검색 쿼리 실행
    const [items, total] = await Promise.all([
      this.prisma.economicIndicator.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ releaseDate: 'desc' }, { name: 'asc' }],
        distinct: ['name', 'country'],
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

    // 로그인한 사용자의 정보 조회
    if (userId) {
      // 관심 지표 조회
      const favoriteIndicators = await this.prisma.favoriteIndicator.findMany({
        where: { userId },
      });

      // 알림 정보 조회
      const indicatorNotifications =
        await this.prisma.indicatorNotification.findMany({
          where: { userId },
        });

      // 관심 지표 ID 추출
      const favoriteIndicatorIds = new Set(
        favoriteIndicators.map((f) => f.indicatorId),
      );

      // 알림 ID 추출
      const notificationIds = new Set(
        indicatorNotifications.map((s) => s.indicatorId),
      );

      // 결과에 관심 정보 및 알림 정보 추가
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
