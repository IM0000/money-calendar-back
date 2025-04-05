import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 기업 검색
   */
  async searchCompanies(searchDto: SearchCompanyDto, userId?: number) {
    const { query, country, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    // 검색 조건 구성
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

    // 기업 검색 쿼리 실행
    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        // _relevance: ticker 매칭을 우선, 그다음 name 매칭
        orderBy: [
          {
            _relevance: {
              fields: ['ticker'],
              search: query,
              sort: 'desc',
            },
          },
          {
            _relevance: {
              fields: ['name'],
              search: query,
              sort: 'desc',
            },
          },
        ],
      }),
      this.prisma.company.count({ where }),
    ]);

    // 결과 초기화
    const itemsWithFavorites = items.map((company) => ({
      ...company,
      isFavoriteEarnings: false,
      isFavoriteDividend: false,
    }));

    // 로그인한 사용자의 관심 정보 조회
    if (userId) {
      // 실적 관심 정보
      const favoriteEarnings = await this.prisma.favoriteEarnings.findMany({
        where: { userId },
        include: { earnings: true },
      });

      // 배당 관심 정보
      const favoriteDividends = await this.prisma.favoriteDividends.findMany({
        where: { userId },
        include: { dividend: true },
      });

      // 관심 기업 ID 추출
      const earningsCompanyIds = new Set(
        favoriteEarnings.map((f) => f.earnings.companyId),
      );
      const dividendsCompanyIds = new Set(
        favoriteDividends.map((f) => f.dividend.companyId),
      );

      // 결과에 관심 정보 추가
      itemsWithFavorites.forEach((company) => {
        company.isFavoriteEarnings = earningsCompanyIds.has(company.id);
        company.isFavoriteDividend = dividendsCompanyIds.has(company.id);
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
    }));

    // 로그인한 사용자의 관심 정보 조회
    if (userId) {
      const favoriteIndicators = await this.prisma.favoriteIndicator.findMany({
        where: { userId },
      });

      // 관심 지표 ID 추출
      const favoriteIndicatorIds = new Set(
        favoriteIndicators.map((f) => f.indicatorId),
      );

      // 결과에 관심 정보 추가
      processedItems.forEach((indicator) => {
        indicator.isFavorite = favoriteIndicatorIds.has(indicator.id);
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
