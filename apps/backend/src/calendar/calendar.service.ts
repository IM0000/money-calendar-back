// src/calendar/calendar.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class CalendarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly favoriteService: FavoriteService,
  ) {}

  /**
   * 관심 추가한 캘린더 이벤트 조회 (로그인한 사용자만 이용 가능)
   * @param userId 사용자 ID (필수)
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   */
  async getFavoriteCalendarEvents(
    userId: number,
    startTimestamp: number,
    endTimestamp: number,
  ) {
    // 사용자의 관심 목록 조회
    const favorites = await this.favoriteService.getAllFavorites(userId);

    // 관심 회사 ID 목록
    const favoriteCompanyIds = favorites.companies.map((c) => c.companyId);

    // 관심 지표 그룹 목록
    const favoriteIndicatorGroups = favorites.indicatorGroups;

    // 관심 회사의 실적 이벤트 조회
    const earnings =
      favoriteCompanyIds.length > 0
        ? await this.prisma.earnings.findMany({
            where: {
              companyId: { in: favoriteCompanyIds },
              releaseDate: {
                gte: startTimestamp,
                lte: endTimestamp,
              },
            },
            include: { company: true },
            orderBy: { releaseDate: 'asc' },
          })
        : [];

    // 관심 회사의 배당 이벤트 조회
    const dividends =
      favoriteCompanyIds.length > 0
        ? await this.prisma.dividend.findMany({
            where: {
              companyId: { in: favoriteCompanyIds },
              exDividendDate: {
                gte: startTimestamp,
                lte: endTimestamp,
              },
            },
            include: { company: true },
            orderBy: { exDividendDate: 'asc' },
          })
        : [];

    // 관심 지표 그룹의 경제지표 이벤트 조회
    const economicIndicators =
      favoriteIndicatorGroups.length > 0
        ? await this.prisma.economicIndicator.findMany({
            where: {
              OR: favoriteIndicatorGroups.map((group) => ({
                baseName: group.baseName,
                country: group.country,
              })),
              releaseDate: {
                gte: startTimestamp,
                lte: endTimestamp,
              },
            },
            orderBy: { releaseDate: 'asc' },
          })
        : [];

    // 사용자의 구독 정보 조회 (hasNotification 필드용)
    const [subscribedCompanies, subscribedIndicatorGroups] = await Promise.all([
      this.prisma.subscriptionCompany.findMany({
        where: { userId, isActive: true },
        select: { companyId: true },
      }),
      this.prisma.subscriptionIndicatorGroup.findMany({
        where: { userId, isActive: true },
        select: { baseName: true, country: true },
      }),
    ]);

    const subscribedCompanyIds = subscribedCompanies.map((s) => s.companyId);

    // 결과 포맷팅
    const formattedEarnings = earnings.map((e) => ({
      id: e.id,
      country: e.country,
      releaseDate: Number(e.releaseDate),
      releaseTiming: e.releaseTiming,
      actualEPS: e.actualEPS,
      forecastEPS: e.forecastEPS,
      previousEPS: e.previousEPS,
      actualRevenue: e.actualRevenue,
      forecastRevenue: e.forecastRevenue,
      previousRevenue: e.previousRevenue,
      company: {
        id: e.company.id,
        ticker: e.company.ticker,
        name: e.company.name,
        country: e.company.country,
        marketValue: e.company.marketValue,
      },
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      isFavorite: true, // 관심 목록에서 조회한 것이므로 항상 true
      hasNotification: subscribedCompanyIds.includes(e.companyId),
    }));

    const formattedDividends = dividends.map((d) => ({
      id: d.id,
      country: d.country,
      exDividendDate: Number(d.exDividendDate),
      dividendAmount: d.dividendAmount,
      previousDividendAmount: d.previousDividendAmount,
      paymentDate: Number(d.paymentDate),
      dividendYield: d.dividendYield,
      company: {
        id: d.company.id,
        ticker: d.company.ticker,
        name: d.company.name,
        country: d.company.country,
        marketValue: d.company.marketValue,
      },
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      isFavorite: true, // 관심 목록에서 조회한 것이므로 항상 true
      hasNotification: subscribedCompanyIds.includes(d.companyId),
    }));

    const formattedEconomicIndicators = economicIndicators.map((e) => {
      const isSubscribed = subscribedIndicatorGroups.some(
        (group) => group.baseName === e.baseName && group.country === e.country,
      );

      return {
        id: e.id,
        country: e.country,
        releaseDate: Number(e.releaseDate),
        name: e.name,
        baseName: e.baseName,
        importance: e.importance,
        actual: e.actual,
        forecast: e.forecast,
        previous: e.previous,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
        isFavorite: true, // 관심 목록에서 조회한 것이므로 항상 true
        hasNotification: isSubscribed,
      };
    });

    return {
      earnings: formattedEarnings,
      dividends: formattedDividends,
      economicIndicators: formattedEconomicIndicators,
    };
  }

  /**
   * 실적(Earnings) 이벤트 조회 (사용자의 관심 정보 포함)
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   * @param userId 사용자 ID (선택사항)
   */
  async getEarningsEvents(
    startTimestamp: number,
    endTimestamp: number,
    userId?: number,
  ) {
    const earnings = await this.prisma.earnings.findMany({
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

    // 사용자의 회사 단위 즐겨찾기/구독 정보 조회
    let favoriteCompanyIds: number[] = [];
    let subscribedCompanyIds: number[] = [];

    if (userId) {
      const [favoriteCompanies, subscribedCompanies] = await Promise.all([
        this.prisma.favoriteCompany.findMany({
          where: { userId, isActive: true },
          select: { companyId: true },
        }),
        this.prisma.subscriptionCompany.findMany({
          where: { userId, isActive: true },
          select: { companyId: true },
        }),
      ]);

      favoriteCompanyIds = favoriteCompanies.map((f) => f.companyId);
      subscribedCompanyIds = subscribedCompanies.map((s) => s.companyId);
    }

    // 결과 가공: EarningsEvent 인터페이스에 맞게 필드 이름 재지정 + 관심 정보 추가
    return earnings.map((e) => ({
      id: e.id,
      country: e.country, // 이벤트의 나라 (Earnings 모델의 country)
      releaseDate: Number(e.releaseDate),
      releaseTiming: e.releaseTiming,
      actualEPS: e.actualEPS,
      forecastEPS: e.forecastEPS,
      previousEPS: e.previousEPS,
      actualRevenue: e.actualRevenue,
      forecastRevenue: e.forecastRevenue,
      previousRevenue: e.previousRevenue,
      company: {
        id: e.company.id,
        ticker: e.company.ticker,
        name: e.company.name,
        country: e.company.country, // 회사의 나라 (Company 모델의 country)
        marketValue: e.company.marketValue,
      },
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      isFavorite: userId ? favoriteCompanyIds.includes(e.companyId) : false,
      hasNotification: userId
        ? subscribedCompanyIds.includes(e.companyId)
        : false,
    }));
  }

  /**
   * 배당(Dividend) 이벤트 조회 (사용자의 관심 정보 포함)
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   * @param userId 사용자 ID (선택사항)
   */
  async getDividendEvents(
    startTimestamp: number,
    endTimestamp: number,
    userId?: number,
  ) {
    const dividends = await this.prisma.dividend.findMany({
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

    // 사용자의 회사 단위 즐겨찾기/구독 정보 조회
    let favoriteCompanyIds: number[] = [];
    let subscribedCompanyIds: number[] = [];

    if (userId) {
      const [favoriteCompanies, subscribedCompanies] = await Promise.all([
        this.prisma.favoriteCompany.findMany({
          where: { userId, isActive: true },
          select: { companyId: true },
        }),
        this.prisma.subscriptionCompany.findMany({
          where: { userId, isActive: true },
          select: { companyId: true },
        }),
      ]);

      favoriteCompanyIds = favoriteCompanies.map((f) => f.companyId);
      subscribedCompanyIds = subscribedCompanies.map((s) => s.companyId);
    }

    // 결과 가공: 프론트엔드 DividendEvent 타입에 맞게 필드 이름 재지정 + 관심 정보 추가
    return dividends.map((d) => ({
      id: d.id,
      country: d.country, // 배당 이벤트의 나라 (Dividend 모델의 country)
      exDividendDate: Number(d.exDividendDate),
      dividendAmount: d.dividendAmount,
      previousDividendAmount: d.previousDividendAmount,
      paymentDate: Number(d.paymentDate),
      dividendYield: d.dividendYield,
      company: {
        id: d.company.id,
        ticker: d.company.ticker,
        name: d.company.name,
        country: d.company.country, // 회사의 나라
        marketValue: d.company.marketValue,
      },
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      isFavorite: userId ? favoriteCompanyIds.includes(d.companyId) : false,
      hasNotification: userId
        ? subscribedCompanyIds.includes(d.companyId)
        : false,
    }));
  }

  /**
   * 경제지표(EconomicIndicator) 이벤트 조회 (사용자의 관심 정보 포함)
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   * @param userId 사용자 ID (선택사항)
   */
  async getEconomicIndicatorsEvents(
    startTimestamp: number,
    endTimestamp: number,
    userId?: number,
  ) {
    const economicIndicators = await this.prisma.economicIndicator.findMany({
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

    // 사용자의 지표 그룹 단위 즐겨찾기/구독 정보 조회
    let favoriteIndicatorGroups: { baseName: string; country: string }[] = [];
    let subscribedIndicatorGroups: { baseName: string; country: string }[] = [];

    if (userId) {
      const [favoriteGroups, subscribedGroups] = await Promise.all([
        this.prisma.favoriteIndicatorGroup.findMany({
          where: { userId, isActive: true },
          select: { baseName: true, country: true },
        }),
        this.prisma.subscriptionIndicatorGroup.findMany({
          where: { userId, isActive: true },
          select: { baseName: true, country: true },
        }),
      ]);

      favoriteIndicatorGroups = favoriteGroups;
      subscribedIndicatorGroups = subscribedGroups;
    }

    // 경제지표 구독 정보 가공
    const formattedIndicators = economicIndicators.map((e) => {
      // baseName/country 기반 즐겨찾기 여부 확인
      const isFavorite =
        userId && e.baseName
          ? favoriteIndicatorGroups.some(
              (f) => f.baseName === e.baseName && f.country === e.country,
            )
          : false;

      // baseName/country 기반 구독 여부 확인
      const hasNotification =
        userId && e.baseName
          ? subscribedIndicatorGroups.some(
              (s) => s.baseName === e.baseName && s.country === e.country,
            )
          : false;

      return {
        id: e.id,
        country: e.country,
        releaseDate: Number(e.releaseDate),
        name: e.name,
        baseName: e.baseName,
        importance: e.importance,
        actual: e.actual,
        forecast: e.forecast,
        previous: e.previous,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
        isFavorite,
        hasNotification,
      };
    });

    return formattedIndicators;
  }

  /**
   * 모든 이벤트(실적, 배당, 경제지표)를 한 번에 조회 (사용자의 관심 정보 포함)
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   * @param userId 사용자 ID (선택사항)
   */
  async getCalendarEvents(
    startTimestamp: number,
    endTimestamp: number,
    userId?: number,
  ) {
    const [earnings, dividends, economicIndicators] = await Promise.all([
      this.getEarningsEvents(startTimestamp, endTimestamp, userId),
      this.getDividendEvents(startTimestamp, endTimestamp, userId),
      this.getEconomicIndicatorsEvents(startTimestamp, endTimestamp, userId),
    ]);

    return { earnings, dividends, economicIndicators };
  }

  /**
   * 특정 기업의 이전 실적 정보 조회 (사용자의 관심 정보 포함)
   * @param companyId 회사 ID
   * @param page 페이지 번호
   * @param limit 한 페이지당 항목 수
   * @param userId 사용자 ID (선택사항)
   */
  async getCompanyEarningsHistory(
    companyId: number,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    // 기본 데이터 조회
    const [earnings, total] = await Promise.all([
      this.prisma.earnings.findMany({
        where: {
          companyId,
        },
        include: {
          company: true,
        },
        orderBy: {
          releaseDate: 'desc', // 최신 실적부터 표시
        },
        skip,
        take: limit,
      }),
      this.prisma.earnings.count({
        where: {
          companyId,
        },
      }),
    ]);

    // 회사 전체 즐겨찾기/구독 여부 확인
    let isFavoriteCompany = false;
    let isSubscribedCompany = false;

    if (userId) {
      const [favoriteCheck, subscriptionCheck] = await Promise.all([
        this.prisma.favoriteCompany.findFirst({
          where: {
            userId,
            companyId,
            isActive: true,
          },
        }),
        this.prisma.subscriptionCompany.findFirst({
          where: { userId, companyId, isActive: true },
        }),
      ]);

      isFavoriteCompany = !!favoriteCheck;
      isSubscribedCompany = !!subscriptionCheck;
    }

    // 결과 가공: 관심 정보 추가
    const formattedEarnings = earnings.map((e) => ({
      id: e.id,
      country: e.country,
      releaseDate: Number(e.releaseDate),
      releaseTiming: e.releaseTiming,
      actualEPS: e.actualEPS,
      forecastEPS: e.forecastEPS,
      previousEPS: e.previousEPS,
      actualRevenue: e.actualRevenue,
      forecastRevenue: e.forecastRevenue,
      previousRevenue: e.previousRevenue,
      company: {
        id: e.company.id,
        ticker: e.company.ticker,
        name: e.company.name,
        companyCountry: e.company.country,
        marketValue: e.company.marketValue,
      },
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      isFavorite: isFavoriteCompany,
      hasNotification: isSubscribedCompany,
    }));

    return {
      items: formattedEarnings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 특정 기업의 이전 배당금 정보 조회 (사용자의 관심 정보 포함)
   * @param companyId 회사 ID
   * @param page 페이지 번호
   * @param limit 한 페이지당 항목 수
   * @param userId 사용자 ID (선택사항)
   */
  async getCompanyDividendHistory(
    companyId: number,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    const [dividends, total] = await Promise.all([
      this.prisma.dividend.findMany({
        where: {
          companyId,
        },
        include: {
          company: true,
        },
        orderBy: {
          exDividendDate: 'desc', // 최신 배당 정보부터 표시
        },
        skip,
        take: limit,
      }),
      this.prisma.dividend.count({
        where: {
          companyId,
        },
      }),
    ]);

    // 회사 전체 즐겨찾기/구독 여부 확인
    let isFavoriteCompany = false;
    let isSubscribedCompany = false;

    if (userId) {
      const [favoriteCheck, subscriptionCheck] = await Promise.all([
        this.prisma.favoriteCompany.findFirst({
          where: {
            userId,
            companyId,
            isActive: true,
          },
        }),
        this.prisma.subscriptionCompany.findFirst({
          where: { userId, companyId, isActive: true },
        }),
      ]);

      isFavoriteCompany = !!favoriteCheck;
      isSubscribedCompany = !!subscriptionCheck;
    }

    // 결과 가공: 관심 정보 추가
    const formattedDividends = dividends.map((d) => ({
      id: d.id,
      country: d.country,
      exDividendDate: Number(d.exDividendDate),
      dividendAmount: d.dividendAmount,
      previousDividendAmount: d.previousDividendAmount,
      paymentDate: Number(d.paymentDate),
      dividendYield: d.dividendYield,
      company: {
        id: d.company.id,
        ticker: d.company.ticker,
        name: d.company.name,
        companyCountry: d.company.country,
        marketValue: d.company.marketValue,
      },
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      isFavorite: isFavoriteCompany,
      hasNotification: isSubscribedCompany,
    }));

    return {
      items: formattedDividends,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 특정 지표 그룹(baseName + country)의 경제지표 히스토리 조회 (사용자의 관심 정보 포함)
   * @param baseName 지표 기본명 (ex: "CPI", "PPI")
   * @param country 국가 코드 (선택사항)
   * @param page 페이지 번호
   * @param limit 한 페이지당 항목 수
   * @param userId 사용자 ID (선택사항)
   */
  async getIndicatorGroupHistory(
    baseName: string,
    country: string | undefined,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    // 조건 생성: country가 있으면 정확히 매칭, 없으면 baseName만 매칭
    const whereCondition = country ? { baseName, country } : { baseName };

    const [indicators, total] = await Promise.all([
      this.prisma.economicIndicator.findMany({
        where: whereCondition,
        orderBy: {
          releaseDate: 'desc', // 최신 지표부터 표시
        },
        skip,
        take: limit,
      }),
      this.prisma.economicIndicator.count({
        where: whereCondition,
      }),
    ]);

    // 지표 그룹 즐겨찾기/구독 여부 확인
    let isFavoriteGroup = false;
    let isSubscribedGroup = false;

    if (userId) {
      const [favoriteCheck, subscriptionCheck] = await Promise.all([
        this.prisma.favoriteIndicatorGroup.findFirst({
          where: {
            userId,
            baseName,
            country,
            isActive: true,
          },
        }),
        this.prisma.subscriptionIndicatorGroup.findFirst({
          where: { userId, baseName, country, isActive: true },
        }),
      ]);

      isFavoriteGroup = !!favoriteCheck;
      isSubscribedGroup = !!subscriptionCheck;
    }

    // 결과 가공: 관심 정보 추가
    const formattedIndicators = indicators.map((indicator) => ({
      id: indicator.id,
      country: indicator.country,
      releaseDate: Number(indicator.releaseDate),
      name: indicator.name,
      baseName: indicator.baseName,
      importance: indicator.importance,
      actual: indicator.actual,
      forecast: indicator.forecast,
      previous: indicator.previous,
      createdAt: indicator.createdAt.toISOString(),
      updatedAt: indicator.updatedAt.toISOString(),
      isFavorite: isFavoriteGroup,
      hasNotification: isSubscribedGroup,
    }));

    return {
      items: formattedIndicators,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
