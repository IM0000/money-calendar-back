// src/calendar/calendar.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 실적(Earnings) 이벤트 조회
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   */
  async getEarningsEvents(startTimestamp: number, endTimestamp: number) {
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

    // 결과 가공: EarningsEvent 인터페이스에 맞게 필드 이름 재지정
    return earnings.map((e) => ({
      id: e.id,
      eventCountry: e.country, // 이벤트의 나라 (Earnings 모델의 country)
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
        companyCountry: e.company.country, // 회사의 나라 (Company 모델의 country)
        marketValue: e.company.marketValue,
      },
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
  }

  /**
   * 배당(Dividend) 이벤트 조회
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   */
  async getDividendEvents(startTimestamp: number, endTimestamp: number) {
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

    // 결과 가공: 프론트엔드 DividendEvent 타입에 맞게 필드 이름 재지정
    return dividends.map((d) => ({
      id: d.id,
      eventCountry: d.country, // 배당 이벤트의 나라 (Dividend 모델의 country)
      exDividendDate: Number(d.exDividendDate),
      dividendAmount: d.dividendAmount,
      previousDividendAmount: d.previousDividendAmount,
      paymentDate: Number(d.paymentDate),
      company: {
        id: d.company.id,
        ticker: d.company.ticker,
        name: d.company.name,
        companyCountry: d.company.country, // 회사의 나라
        marketValue: d.company.marketValue,
      },
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));
  }

  /**
   * 경제지표(EconomicIndicator) 이벤트 조회
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   */
  async getEconomicIndicatorsEvents(
    startTimestamp: number,
    endTimestamp: number,
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

    // 결과 가공: 프론트엔드 EconomicIndicatorEvent 타입에 맞게 필드 이름 재지정
    return economicIndicators.map((e) => ({
      id: e.id,
      eventCountry: e.country, // 경제지표 이벤트의 나라 (EconomicIndicator 모델의 country)
      releaseDate: Number(e.releaseDate),
      name: e.name,
      importance: e.importance,
      actual: e.actual,
      forecast: e.forecast,
      previous: e.previous,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
  }

  /**
   * 모든 이벤트(실적, 배당, 경제지표)를 한 번에 조회
   * @param startTimestamp 조회 시작 밀리초
   * @param endTimestamp 조회 종료 밀리초
   */
  async getCalendarEvents(startTimestamp: number, endTimestamp: number) {
    const [earnings, dividends, economicIndicators] = await Promise.all([
      this.getEarningsEvents(startTimestamp, endTimestamp),
      this.getDividendEvents(startTimestamp, endTimestamp),
      this.getEconomicIndicatorsEvents(startTimestamp, endTimestamp),
    ]);

    return { earnings, dividends, economicIndicators };
  }

  /**
   * 특정 기업의 이전 실적 정보 조회
   * @param companyId 회사 ID
   * @param page 페이지 번호
   * @param limit 한 페이지당 항목 수
   */
  async getCompanyEarningsHistory(
    companyId: number,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

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

    // 결과 가공
    const formattedEarnings = earnings.map((e) => ({
      id: e.id,
      eventCountry: e.country,
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
}
