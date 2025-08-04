import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  async searchCompanies(searchDto: SearchCompanyDto, userId?: number) {
    const { query, country, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const items = await this.searchRepository.searchCompaniesRaw(
      query || '',
      country || '',
      limit,
      skip,
    );

    const total = await this.searchRepository.countCompanies(query, country);

    const itemsWithFavorites = items.map((company) => ({
      ...company,
      isFavorite: false,
      hasSubscription: false,
    }));

    if (userId) {
      // 회사 단위 즐겨찾기 정보 조회
      const favoriteCompanies =
        await this.searchRepository.findFavoriteCompanies(
          userId,
          items.map((c) => c.id),
        );

      // 회사 단위 구독 정보 조회
      const subscriptionCompanies =
        await this.searchRepository.findSubscriptionCompanies(
          userId,
          items.map((c) => c.id),
        );

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

    const [groupsWithCount, totalGroups] = await Promise.all([
      this.searchRepository.groupIndicatorsByBaseName(where, skip, limit),
      this.searchRepository.countIndicatorGroups(where),
    ]);

    const total = totalGroups.length;

    if (groupsWithCount.length === 0) {
      return {
        items: [],
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    const items = await this.searchRepository.findIndicatorsByGroups(
      groupsWithCount,
    );

    const processedItems = items.map((indicator) => ({
      ...indicator,
      releaseDate: indicator.releaseDate ? Number(indicator.releaseDate) : null,
      isFavorite: false,
      hasNotification: false,
    }));

    if (userId) {
      // 지표 그룹 단위 즐겨찾기 정보 조회
      const favoriteIndicatorGroups =
        await this.searchRepository.findFavoriteIndicatorGroups(userId);

      // 지표 그룹 단위 구독 정보 조회
      const subscriptionIndicatorGroups =
        await this.searchRepository.findSubscriptionIndicatorGroups(userId);

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
