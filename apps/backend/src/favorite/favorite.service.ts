import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavoriteCompany(userId: number, companyId: number) {
    return await this.prisma.favoriteCompany.upsert({
      where: { userId_companyId: { userId, companyId } },
      update: { isActive: true },
      create: { userId, companyId, isActive: true },
    });
  }

  async removeFavoriteCompany(userId: number, companyId: number) {
    const existing = await this.prisma.favoriteCompany.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    if (!existing || !existing.isActive) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    return await this.prisma.favoriteCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { isActive: false },
    });
  }

  async getFavoriteCompanies(userId: number) {
    return await this.prisma.favoriteCompany.findMany({
      where: { userId, isActive: true },
      include: { company: true },
    });
  }

  async addFavoriteIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ) {
    return await this.prisma.favoriteIndicatorGroup.upsert({
      where: { userId_baseName_country: { userId, baseName, country } },
      update: { isActive: true },
      create: { userId, baseName, country, isActive: true },
    });
  }

  async removeFavoriteIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ) {
    const existing = await this.prisma.favoriteIndicatorGroup.findUnique({
      where: { userId_baseName_country: { userId, baseName, country } },
    });
    if (!existing || !existing.isActive) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    return await this.prisma.favoriteIndicatorGroup.update({
      where: { userId_baseName_country: { userId, baseName, country } },
      data: { isActive: false },
    });
  }

  async getFavoriteIndicatorGroups(userId: number) {
    return await this.prisma.favoriteIndicatorGroup.findMany({
      where: { userId, isActive: true },
      select: { baseName: true, country: true },
    });
  }

  async getAllFavorites(userId: number) {
    const companies = await this.getFavoriteCompanies(userId);
    const indicatorGroups = await this.getFavoriteIndicatorGroups(userId);
    return {
      companies,
      indicatorGroups,
    };
  }
}
