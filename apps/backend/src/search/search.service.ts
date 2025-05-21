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

    // 파라미터 배열과 WHERE 절 동적 생성
    const params: unknown[] = [];
    const conditions: string[] = [];

    if (query) {
      params.push(`%${query}%`);
      conditions.push(
        `("name" ILIKE $${params.length} OR "ticker" ILIKE $${params.length})`,
      );
    }

    if (country) {
      params.push(country);
      conditions.push(`"country" = $${params.length}`);
    }

    const whereSql = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // LIMIT, OFFSET은 항상 맨 뒤에 추가
    params.push(limit, skip);
    const limitPlaceholder = `$${params.length - 1}`;
    const offsetPlaceholder = `$${params.length}`;

    // ORDER BY 절: query가 있을 때만 CASE문, 없으면 name만 정렬
    const orderByClause = query
      ? `(CASE WHEN "ticker" ILIKE $1 THEN 0 ELSE 1 END), "name" ASC`
      : `"name" ASC`;

    // 최종 SQL 조립
    const sql = `
      SELECT *
        FROM "Company"
        ${whereSql}
        ORDER BY ${orderByClause}
        LIMIT ${limitPlaceholder}
        OFFSET ${offsetPlaceholder};
    `;

    // Raw query 실행 (문자열 + 파라미터 분리)
    const items = await this.prisma.$queryRawUnsafe<Company[]>(sql, ...params);

    // 전체 건수 조회

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
    const total = await this.prisma.company.count({ where });

    // favorites 매핑
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
