import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CompanyDto,
  DividendDto,
  EarningsDto,
  EconomicIndicatorDto,
  IngestDto,
  SourceName,
} from './dto/ingest.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IngestService {
  constructor(private readonly prisma: PrismaService) {}

  async handleScrapedData(dto: IngestDto): Promise<void> {
    const { sourceName, data } = dto;

    switch (sourceName) {
      case SourceName.Company:
        await this.saveCompanyData(data as CompanyDto[]);
        break;

      case SourceName.EconomicIndicator:
        await this.saveEconomicIndicatorData(data as EconomicIndicatorDto[]);
        break;

      case SourceName.Earnings:
        await this.prisma.$transaction(async (tx) => {
          await this.saveEarningsData(data as EarningsDto[], tx);
        });
        await this.updateEarningsPreviousValues(this.prisma);
        break;

      case SourceName.Dividend:
        await this.prisma.$transaction(async (tx) => {
          await this.saveDividendData(data as DividendDto[], tx);
          await this.updateDividendPreviousValues(tx);
        });
        break;

      default:
        throw new BadRequestException(`Unknown sourceName: ${sourceName}`);
    }
  }

  private async saveCompanyData(companies: CompanyDto[]) {
    const tasks = companies.map((data) =>
      this.prisma.company.upsert({
        where: {
          ticker_country: {
            ticker: data.ticker,
            country: data.country,
          },
        },
        create: {
          ticker: data.ticker,
          country: data.country,
          name: data.name,
          marketValue: data.marketValue,
        },
        update: {
          name: data.name,
          marketValue: data.marketValue,
          updatedAt: new Date(),
        },
      }),
    );
    await Promise.all(tasks);
  }

  private async saveEconomicIndicatorData(indicators: EconomicIndicatorDto[]) {
    const tasks = indicators.map((data) => {
      const payload = {
        country: data.country,
        releaseDate: data.releaseDate,
        name: data.name,
        importance: data.importance,
        actual: data.actual,
        forecast: data.forecast,
        previous: data.previous ?? '',
      };
      return this.prisma.economicIndicator.upsert({
        where: {
          releaseDate_name_country: {
            name: data.name,
            country: data.country,
            releaseDate: data.releaseDate,
          },
        },
        create: payload,
        update: payload,
      });
    });
    await Promise.all(tasks);
  }

  private async saveEarningsData(
    earnings: EarningsDto[],
    tx: Prisma.TransactionClient,
  ) {
    for (const data of earnings) {
      const company = await tx.company.findFirst({
        where: { ticker: data.ticker, country: data.country },
      });
      if (!company) continue;

      const payload = {
        country: data.country,
        releaseDate: data.releaseDate,
        releaseTiming: data.releaseTiming,
        actualEPS: data.actualEPS,
        forecastEPS: data.forecastEPS,
        previousEPS: data.previousEPS ?? '',
        actualRevenue: data.actualRevenue,
        forecastRevenue: data.forecastRevenue,
        previousRevenue: data.previousRevenue ?? '',
        company: { connect: { id: company.id } },
      };

      await tx.earnings.upsert({
        where: {
          releaseDate_companyId: {
            companyId: company.id,
            releaseDate: data.releaseDate,
          },
        },
        create: payload,
        update: payload,
      });
    }
  }

  private async updateEarningsPreviousValues(
    client: PrismaService | Prisma.TransactionClient,
  ) {
    const records = await client.earnings.findMany({
      where: { previousEPS: '', previousRevenue: '' },
      orderBy: { releaseDate: 'asc' },
    });
    for (const record of records) {
      const prev = await client.earnings.findFirst({
        where: {
          companyId: record.companyId,
          releaseDate: { lt: record.releaseDate },
        },
        orderBy: { releaseDate: 'desc' },
      });
      if (prev) {
        await client.earnings.update({
          where: { id: record.id },
          data: {
            previousEPS: prev.actualEPS,
            previousRevenue: prev.actualRevenue,
          },
        });
      }
    }
  }

  private async saveDividendData(
    dividends: DividendDto[],
    tx: Prisma.TransactionClient,
  ) {
    for (const data of dividends) {
      const company = await tx.company.findFirst({
        where: { ticker: data.ticker, country: data.country },
      });
      if (!company) continue;

      const payload = {
        country: data.country,
        exDividendDate: data.exDividendDate,
        dividendAmount: data.dividendAmount,
        previousDividendAmount: data.previousDividendAmount ?? '',
        paymentDate: data.paymentDate,
        dividendYield: data.dividendYield,
        company: { connect: { id: company.id } },
      };

      await tx.dividend.upsert({
        where: {
          exDividendDate_companyId: {
            companyId: company.id,
            exDividendDate: data.exDividendDate,
          },
        },
        create: payload,
        update: payload,
      });
    }
  }

  private async updateDividendPreviousValues(tx: Prisma.TransactionClient) {
    const records = await tx.dividend.findMany({
      where: { previousDividendAmount: '' },
      orderBy: { exDividendDate: 'asc' },
    });
    for (const record of records) {
      const prev = await tx.dividend.findFirst({
        where: {
          companyId: record.companyId,
          exDividendDate: { lt: record.exDividendDate },
        },
        orderBy: { exDividendDate: 'desc' },
      });
      if (prev) {
        await tx.dividend.update({
          where: { id: record.id },
          data: { previousDividendAmount: prev.dividendAmount },
        });
      }
    }
  }
}
