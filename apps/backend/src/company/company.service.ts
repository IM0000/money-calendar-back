import {
  convertDividendBigInt,
  convertEarningsBigInt,
} from '../common/utils/convert-bigint';
import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getCompanyEarnings(
    companyId: number,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    const [earningsItems, total] = await Promise.all([
      this.companyRepository.getCompanyEarnings(companyId, skip, limit),
      this.companyRepository.getCompanyEarningsCount(companyId),
    ]);

    let isFavoriteCompany = false;
    let hasCompanySubscription = false;

    if (userId) {
      const favoriteCompany = await this.companyRepository.getFavoriteCompany(
        userId,
        companyId,
      );
      isFavoriteCompany = favoriteCompany?.isActive ?? false;

      const companySubscription =
        await this.companyRepository.getCompanySubscription(userId, companyId);
      hasCompanySubscription = companySubscription?.isActive ?? false;
    }

    const items = convertEarningsBigInt(
      earningsItems.map((item) => ({
        ...item,
        isFavorite: isFavoriteCompany,
        hasNotification: hasCompanySubscription,
      })),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getCompanyDividends(
    companyId: number,
    page: number,
    limit: number,
    userId?: number,
  ) {
    const skip = (page - 1) * limit;

    const [dividendItems, total] = await Promise.all([
      this.companyRepository.getCompanyDividends(companyId, skip, limit),
      this.companyRepository.getCompanyDividendsCount(companyId),
    ]);

    let isFavoriteCompany = false;
    let hasCompanySubscription = false;

    if (userId) {
      const favoriteCompany = await this.companyRepository.getFavoriteCompany(
        userId,
        companyId,
      );
      isFavoriteCompany = favoriteCompany?.isActive ?? false;

      const companySubscription =
        await this.companyRepository.getCompanySubscription(userId, companyId);
      hasCompanySubscription = companySubscription?.isActive ?? false;
    }

    const items = convertDividendBigInt(
      dividendItems.map((item) => ({
        ...item,
        isFavorite: isFavoriteCompany,
        hasNotification: hasCompanySubscription,
      })),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
