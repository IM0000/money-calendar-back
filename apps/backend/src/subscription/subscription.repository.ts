import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SubscriptionCompany,
  SubscriptionIndicatorGroup,
  Company,
  EconomicIndicator,
} from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCompanyById(companyId: number): Promise<Company | null> {
    return await this.prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  async upsertCompanySubscription(
    userId: number,
    companyId: number,
    isActive = true,
  ): Promise<SubscriptionCompany> {
    return await this.prisma.subscriptionCompany.upsert({
      where: { userId_companyId: { userId, companyId } },
      update: { isActive },
      create: { userId, companyId, isActive },
    });
  }

  async findCompanySubscription(
    userId: number,
    companyId: number,
  ): Promise<SubscriptionCompany | null> {
    return await this.prisma.subscriptionCompany.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
  }

  async updateCompanySubscription(
    userId: number,
    companyId: number,
    isActive: boolean,
  ): Promise<SubscriptionCompany> {
    return await this.prisma.subscriptionCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { isActive },
    });
  }

  async findUserCompanySubscriptions(
    userId: number,
  ): Promise<SubscriptionCompany[]> {
    return await this.prisma.subscriptionCompany.findMany({
      where: { userId, isActive: true },
      include: { company: true },
    });
  }

  async findActiveCompanySubscription(
    userId: number,
    companyId: number,
  ): Promise<SubscriptionCompany | null> {
    return await this.prisma.subscriptionCompany.findUnique({
      where: {
        userId_companyId: { userId, companyId },
        isActive: true,
      },
    });
  }

  async findCompanySubscribers(
    companyId: number,
  ): Promise<{ userId: number }[]> {
    return await this.prisma.subscriptionCompany.findMany({
      where: { companyId, isActive: true },
      select: { userId: true },
    });
  }

  async findIndicatorGroupByBaseNameAndCountry(
    baseName: string,
    country: string,
  ): Promise<EconomicIndicator | null> {
    return await this.prisma.economicIndicator.findFirst({
      where: { baseName, country },
    });
  }

  async upsertIndicatorGroupSubscription(
    userId: number,
    baseName: string,
    country: string,
    isActive = true,
  ): Promise<SubscriptionIndicatorGroup> {
    return await this.prisma.subscriptionIndicatorGroup.upsert({
      where: { userId_baseName_country: { userId, baseName, country } },
      update: { isActive },
      create: { userId, baseName, country, isActive },
    });
  }

  async findIndicatorGroupSubscription(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<SubscriptionIndicatorGroup | null> {
    return await this.prisma.subscriptionIndicatorGroup.findUnique({
      where: { userId_baseName_country: { userId, baseName, country } },
    });
  }

  async updateIndicatorGroupSubscription(
    userId: number,
    baseName: string,
    country: string,
    isActive: boolean,
  ): Promise<SubscriptionIndicatorGroup> {
    return await this.prisma.subscriptionIndicatorGroup.update({
      where: { userId_baseName_country: { userId, baseName, country } },
      data: { isActive },
    });
  }

  async findUserIndicatorGroupSubscriptions(
    userId: number,
  ): Promise<SubscriptionIndicatorGroup[]> {
    return await this.prisma.subscriptionIndicatorGroup.findMany({
      where: { userId, isActive: true },
    });
  }

  async findActiveIndicatorGroupSubscription(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<SubscriptionIndicatorGroup | null> {
    return await this.prisma.subscriptionIndicatorGroup.findUnique({
      where: {
        userId_baseName_country: { userId, baseName, country },
        isActive: true,
      },
    });
  }

  async findIndicatorGroupSubscribers(
    baseName: string,
    country: string,
  ): Promise<{ userId: number }[]> {
    return await this.prisma.subscriptionIndicatorGroup.findMany({
      where: { baseName, country, isActive: true },
      select: { userId: true },
    });
  }
}
