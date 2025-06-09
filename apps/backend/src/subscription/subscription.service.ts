import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionCompany } from '@prisma/client';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribeCompany(userId: number, companyId: number): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    await this.prisma.subscriptionCompany.upsert({
      where: { userId_companyId: { userId, companyId } },
      update: { isActive: true },
      create: { userId, companyId, isActive: true },
    });
  }

  async unsubscribeCompany(userId: number, companyId: number): Promise<void> {
    const subscription = await this.prisma.subscriptionCompany.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!subscription || !subscription.isActive) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    await this.prisma.subscriptionCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { isActive: false },
    });
  }

  async getSubscriptionCompanies(
    userId: number,
  ): Promise<SubscriptionCompany[]> {
    const subscriptions = await this.prisma.subscriptionCompany.findMany({
      where: { userId, isActive: true },
      include: { company: true },
    });
    return subscriptions;
  }

  async isCompanySubscribed(
    userId: number,
    companyId: number,
  ): Promise<boolean> {
    const subscription = await this.prisma.subscriptionCompany.findUnique({
      where: {
        userId_companyId: { userId, companyId },
        isActive: true,
      },
    });
    return !!subscription;
  }

  async getCompanySubscribers(companyId: number) {
    return await this.prisma.subscriptionCompany.findMany({
      where: { companyId, isActive: true },
      select: { userId: true },
    });
  }

  async subscribeIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void> {
    const indicatorGroup = await this.prisma.economicIndicator.findFirst({
      where: { baseName: baseName, country: country },
    });

    if (!indicatorGroup) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    await this.prisma.subscriptionIndicatorGroup.upsert({
      where: { userId_baseName_country: { userId, baseName, country } },
      update: { isActive: true },
      create: { userId, baseName, country, isActive: true },
    });
  }

  async unsubscribeIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void> {
    const subscription =
      await this.prisma.subscriptionIndicatorGroup.findUnique({
        where: { userId_baseName_country: { userId, baseName, country } },
      });

    if (!subscription || !subscription.isActive) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    await this.prisma.subscriptionIndicatorGroup.update({
      where: { userId_baseName_country: { userId, baseName, country } },
      data: { isActive: false },
    });
  }

  async getSubscriptionIndicatorGroups(
    userId: number,
  ): Promise<{ baseName: string; country?: string }[]> {
    const subscriptions = await this.prisma.subscriptionIndicatorGroup.findMany(
      {
        where: { userId, isActive: true },
      },
    );

    return subscriptions;
  }

  async isIndicatorGroupSubscribed(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<boolean> {
    const subscription =
      await this.prisma.subscriptionIndicatorGroup.findUnique({
        where: {
          userId_baseName_country: { userId, baseName, country },
          isActive: true,
        },
      });
    return !!subscription;
  }

  async getIndicatorGroupSubscribers(baseName: string, country: string) {
    return await this.prisma.subscriptionIndicatorGroup.findMany({
      where: { baseName, country, isActive: true },
      select: { userId: true },
    });
  }
}
