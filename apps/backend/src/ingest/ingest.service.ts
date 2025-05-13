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
          await this.updateEarningsPreviousValues(tx);
        });
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
    for (const data of companies) {
      const existing = await this.prisma.company.findFirst({
        where: { ticker: data.ticker, country: data.country },
      });
      if (existing) {
        await this.prisma.company.update({
          where: { id: existing.id },
          data: {
            name: data.name,
            marketValue: data.marketValue,
            updatedAt: new Date(),
          },
        });
      } else {
        await this.prisma.company.create({ data });
      }
    }
  }

  private async saveEconomicIndicatorData(indicators: EconomicIndicatorDto[]) {
    for (const data of indicators) {
      const existing = await this.prisma.economicIndicator.findFirst({
        where: {
          name: data.name,
          country: data.country,
          releaseDate: data.releaseDate,
        },
      });
      const payload = {
        country: data.country,
        releaseDate: data.releaseDate,
        name: data.name,
        importance: data.importance,
        actual: data.actual,
        forecast: data.forecast,
        previous: data.previous ?? '',
      };
      console.log(payload);
      if (existing) {
        await this.prisma.economicIndicator.update({
          where: { id: existing.id },
          data: payload,
        });
      } else {
        await this.prisma.economicIndicator.create({ data: payload });
      }
    }
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

      const existing = await tx.earnings.findFirst({
        where: { companyId: company.id, releaseDate: data.releaseDate },
      });
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

      if (existing) {
        await tx.earnings.update({ where: { id: existing.id }, data: payload });
      } else {
        await tx.earnings.create({ data: payload });
      }
    }
  }

  private async updateEarningsPreviousValues(tx: Prisma.TransactionClient) {
    const records = await tx.earnings.findMany({
      where: { previousEPS: '', previousRevenue: '' },
      orderBy: { releaseDate: 'asc' },
    });
    for (const record of records) {
      const prev = await tx.earnings.findFirst({
        where: {
          companyId: record.companyId,
          releaseDate: { lt: record.releaseDate },
        },
        orderBy: { releaseDate: 'desc' },
      });
      if (prev) {
        await tx.earnings.update({
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

      const existing = await tx.dividend.findFirst({
        where: { companyId: company.id, exDividendDate: data.exDividendDate },
      });
      const payload = {
        country: data.country,
        exDividendDate: data.exDividendDate,
        dividendAmount: data.dividendAmount,
        previousDividendAmount: data.previousDividendAmount ?? '',
        paymentDate: data.paymentDate,
        dividendYield: data.dividendYield,
        company: { connect: { id: company.id } },
      };
      if (existing) {
        await tx.dividend.update({ where: { id: existing.id }, data: payload });
      } else {
        await tx.dividend.create({ data: payload });
      }
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
