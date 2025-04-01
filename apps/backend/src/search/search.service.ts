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
  async searchCompanies(searchDto: SearchCompanyDto) {
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
    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              earnings: true,
              dividends: true,
            },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      companies,
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
  async searchIndicators(searchDto: SearchIndicatorDto) {
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
    const [indicators, total] = await Promise.all([
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

    return {
      indicators,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
