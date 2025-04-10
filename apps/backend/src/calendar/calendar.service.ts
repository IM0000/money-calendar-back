// src/calendar/calendar.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

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
        favorites: userId
          ? {
              where: {
                userId,
              },
            }
          : false,
        notifications: userId
          ? {
              where: {
                userId,
              },
            }
          : false,
      },
      orderBy: {
        releaseDate: 'asc',
      },
    });

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
      isFavorite: userId ? e.favorites.length > 0 : false,
      hasNotification: userId ? e.notifications?.length > 0 : false,
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
        favorites: userId
          ? {
              where: {
                userId,
              },
            }
          : false,
      },
      orderBy: {
        exDividendDate: 'asc',
      },
    });

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
      isFavorite: userId ? d.favorites.length > 0 : false,
      hasNotification: false,
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
      include: {
        favorites: userId
          ? {
              where: {
                userId,
              },
            }
          : false,
        notifications: userId
          ? {
              where: {
                userId,
              },
            }
          : false,
      },
      orderBy: {
        releaseDate: 'asc',
      },
    });

    // 결과 가공: 프론트엔드 EconomicIndicatorEvent 타입에 맞게 필드 이름 재지정 + 관심 정보 추가
    return economicIndicators.map((e) => ({
      id: e.id,
      country: e.country, // 경제지표 이벤트의 나라 (EconomicIndicator 모델의 country)
      releaseDate: Number(e.releaseDate),
      name: e.name,
      importance: e.importance,
      actual: e.actual,
      forecast: e.forecast,
      previous: e.previous,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      isFavorite: userId ? e.favorites.length > 0 : false,
      hasNotification: userId ? e.notifications?.length > 0 : false,
    }));
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

    const [earnings, total] = await Promise.all([
      this.prisma.earnings.findMany({
        where: {
          companyId,
        },
        include: {
          company: true,
          favorites: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
          notifications: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
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
      isFavorite: userId ? e.favorites.length > 0 : false,
      hasNotification: userId ? e.notifications?.length > 0 : false,
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
          favorites: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
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
      isFavorite: userId ? d.favorites.length > 0 : false,
      hasNotification: false,
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
}
