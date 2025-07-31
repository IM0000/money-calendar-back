import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Company, EconomicIndicator } from '@prisma/client';

@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchCompaniesRaw(
    query: string,
    country: string,
    limit: number,
    skip: number,
  ): Promise<Company[]> {
    const q = `%${query}%`;

    return await this.prisma.$queryRaw<Company[]>`
      SELECT *
        FROM "Company"
      WHERE
        (${query} = '' OR "name" ILIKE ${q} OR "ticker"::text ILIKE ${q})
        AND (${country} = '' OR country = ${country})
      ORDER BY
        CASE WHEN "ticker"::text ILIKE ${q} THEN 0 ELSE 1 END,
        "name" ASC
      LIMIT ${limit}
      OFFSET ${skip};
    `;
  }

  async countCompanies(query?: string, country?: string): Promise<number> {
    return await this.prisma.company.count({
      where: {
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { ticker: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(country ? { country } : {}),
      },
    });
  }

  async findFavoriteCompanies(
    userId: number,
    companyIds: number[],
  ): Promise<{ companyId: number }[]> {
    return await this.prisma.favoriteCompany.findMany({
      where: {
        userId,
        companyId: { in: companyIds },
        isActive: true,
      },
      select: { companyId: true },
    });
  }

  async findSubscriptionCompanies(
    userId: number,
    companyIds: number[],
  ): Promise<{ companyId: number }[]> {
    return await this.prisma.subscriptionCompany.findMany({
      where: {
        userId,
        companyId: { in: companyIds },
        isActive: true,
      },
      select: { companyId: true },
    });
  }

  async groupIndicatorsByBaseName(
    where: Prisma.EconomicIndicatorWhereInput,
    skip: number,
    limit: number,
  ) {
    return await this.prisma.economicIndicator.groupBy({
      by: ['baseName', 'country'],
      where,
      orderBy: [{ baseName: 'asc' }, { country: 'asc' }],
      skip,
      take: limit,
    });
  }

  async countIndicatorGroups(where: Prisma.EconomicIndicatorWhereInput) {
    return await this.prisma.economicIndicator.groupBy({
      by: ['baseName', 'country'],
      where,
    });
  }

  async findIndicatorsByGroups(
    groups: { baseName: string; country: string }[],
  ): Promise<EconomicIndicator[]> {
    return await this.prisma.economicIndicator.findMany({
      where: {
        OR: groups.map((group) => ({
          baseName: group.baseName,
          country: group.country,
        })),
      },
      orderBy: [{ releaseDate: 'desc' }, { importance: 'desc' }],
      distinct: ['baseName', 'country'],
    });
  }

  async findFavoriteIndicatorGroups(
    userId: number,
  ): Promise<{ baseName: string; country: string }[]> {
    return await this.prisma.favoriteIndicatorGroup.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: { baseName: true, country: true },
    });
  }

  async findSubscriptionIndicatorGroups(
    userId: number,
  ): Promise<{ baseName: string; country: string }[]> {
    return await this.prisma.subscriptionIndicatorGroup.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: { baseName: true, country: true },
    });
  }
}
