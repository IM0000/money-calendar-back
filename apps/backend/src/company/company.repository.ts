import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyEarnings(companyId: number, skip: number, take: number) {
    return await this.prisma.earnings.findMany({
      where: { companyId },
      skip,
      take,
      orderBy: { releaseDate: 'desc' },
    });
  }

  async getCompanyEarningsCount(companyId: number) {
    return await this.prisma.earnings.count({
      where: { companyId },
    });
  }

  async getCompanyDividends(companyId: number, skip: number, take: number) {
    return await this.prisma.dividend.findMany({
      where: { companyId },
      skip,
      take,
      orderBy: { exDividendDate: 'desc' },
    });
  }

  async getCompanyDividendsCount(companyId: number) {
    return await this.prisma.dividend.count({
      where: { companyId },
    });
  }

  async getFavoriteCompany(userId: number, companyId: number) {
    return await this.prisma.favoriteCompany.findUnique({
      where: {
        userId_companyId: { userId, companyId },
      },
    });
  }

  async getCompanySubscription(userId: number, companyId: number) {
    return await this.prisma.subscriptionCompany.findUnique({
      where: {
        userId_companyId: { userId, companyId },
      },
    });
  }
}
