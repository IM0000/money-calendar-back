import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  async saveCompanyData(
    companyData: {
      ticker: string;
      name: string;
      country: string;
      marketValue: string;
    }[],
  ) {
    for (const data of companyData) {
      try {
        const existingCompany = await this.prisma.company.findFirst({
          where: {
            ticker: data.ticker,
            country: data.country,
          },
        });

        if (existingCompany) {
          await this.prisma.company.update({
            where: { id: existingCompany.id },
            data: {
              name: data.name,
              marketValue: data.marketValue,
              updatedAt: new Date(),
            },
          });
          console.log(`Updated company: ${data.name} (${data.ticker})`);
        } else {
          await this.prisma.company.create({
            data: {
              ticker: data.ticker,
              name: data.name,
              country: data.country,
              marketValue: data.marketValue,
            },
          });
          console.log(`Created new company: ${data.name} (${data.ticker})`);
        }
      } catch (error) {
        console.error(`Error saving company data for ${data.ticker}:`, error);
      }
    }
  }

  async saveEconomicIndicatorData(economicIndicators: any[]) {
    for (const data of economicIndicators) {
      const existingRecord = await this.prisma.economicIndicator.findFirst({
        where: {
          name: data.name,
          country: data.country,
          releaseDate: data.releaseDate,
        },
      });

      if (existingRecord) {
        await this.prisma.economicIndicator.update({
          where: { id: existingRecord.id },
          data: {
            baseName: data.baseName,
            importance: data.importance,
            actual: data.actual,
            forecast: data.forecast,
            previous: data.previous,
          },
        });
      } else {
        await this.prisma.economicIndicator.create({
          data: {
            country: data.country,
            releaseDate: data.releaseDate,
            name: data.name,
            baseName: data.baseName,
            importance: data.importance,
            actual: data.actual,
            forecast: data.forecast,
            previous: data.previous,
          },
        });
      }
    }
  }

  async saveEarningsData(earningsData: any[]) {
    for (const data of earningsData) {
      const company = await this.prisma.company.findFirst({
        where: {
          ticker: data.ticker,
          country: data.country,
        },
      });

      if (!company) {
        continue;
      }

      const existingRecord = await this.prisma.earnings.findFirst({
        where: {
          releaseDate: data.releaseDate,
          companyId: company.id,
        },
      });

      if (existingRecord) {
        await this.prisma.earnings.update({
          where: { id: existingRecord.id },
          data: {
            releaseTiming: data.releaseTiming,
            actualEPS: data.actualEPS,
            forecastEPS: data.forecastEPS,
            actualRevenue: data.actualRevenue,
            forecastRevenue: data.forecastRevenue,
          },
        });
      } else {
        await this.prisma.earnings.create({
          data: {
            releaseDate: data.releaseDate,
            releaseTiming: data.releaseTiming,
            actualEPS: data.actualEPS,
            forecastEPS: data.forecastEPS,
            previousEPS: '',
            actualRevenue: data.actualRevenue,
            forecastRevenue: data.forecastRevenue,
            previousRevenue: '',
            company: {
              connect: { id: company.id },
            },
            country: data.country,
          },
        });
      }
    }
  }

  async updateEarningsPreviousValues() {
    const earningsRecords = await this.prisma.earnings.findMany({
      where: {
        previousEPS: '',
        previousRevenue: '',
      },
      orderBy: { releaseDate: 'asc' },
    });

    for (const record of earningsRecords) {
      const previousRecord = await this.prisma.earnings.findFirst({
        where: {
          companyId: record.companyId,
          releaseDate: { lt: record.releaseDate }, // 현재 레코드보다 이전인 데이터만 조회
        },
        orderBy: { releaseDate: 'desc' },
      });

      if (previousRecord) {
        await this.prisma.earnings.update({
          where: { id: record.id },
          data: {
            previousEPS: previousRecord.actualEPS,
            previousRevenue: previousRecord.actualRevenue,
          },
        });
      }
    }
  }

  async saveDividendData(dividendData: any[]) {
    for (const data of dividendData) {
      const company = await this.prisma.company.findFirst({
        where: {
          ticker: data.ticker,
          country: data.country,
        },
      });

      if (!company) {
        continue;
      }

      const existingRecord = await this.prisma.dividend.findFirst({
        where: {
          exDividendDate: data.exDividendDate,
          companyId: company.id,
        },
      });

      if (existingRecord) {
        await this.prisma.dividend.update({
          where: { id: existingRecord.id },
          data: {
            dividendAmount: data.dividendAmount,
            paymentDate: data.paymentDate,
            previousDividendAmount: data.previousDividendAmount,
            dividendYield: data.dividendYield,
          },
        });
      } else {
        await this.prisma.dividend.create({
          data: {
            exDividendDate: data.exDividendDate,
            dividendAmount: data.dividendAmount,
            previousDividendAmount: data.previousDividendAmount,
            paymentDate: data.paymentDate,
            dividendYield: data.dividendYield,
            company: {
              connect: { id: company.id },
            },
            country: data.country,
          },
        });
      }
    }
  }

  async updateDividendPreviousValues() {
    const dividendRecords = await this.prisma.dividend.findMany({
      where: {
        previousDividendAmount: '',
      },
      orderBy: { exDividendDate: 'asc' },
    });

    for (const record of dividendRecords) {
      const previousRecord = await this.prisma.dividend.findFirst({
        where: {
          companyId: record.companyId,
          exDividendDate: { lt: record.exDividendDate },
        },
        orderBy: { exDividendDate: 'desc' },
      });

      if (previousRecord) {
        await this.prisma.dividend.update({
          where: { id: record.id },
          data: {
            previousDividendAmount: previousRecord.dividendAmount,
          },
        });
      }
    }
  }
}
