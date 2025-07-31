import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionCompany } from '@prisma/client';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async subscribeCompany(userId: number, companyId: number): Promise<void> {
    const company = await this.subscriptionRepository.findCompanyById(
      companyId,
    );

    if (!company) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    await this.subscriptionRepository.upsertCompanySubscription(
      userId,
      companyId,
      true,
    );
  }

  async unsubscribeCompany(userId: number, companyId: number): Promise<void> {
    const subscription =
      await this.subscriptionRepository.findCompanySubscription(
        userId,
        companyId,
      );

    if (!subscription || !subscription.isActive) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    await this.subscriptionRepository.updateCompanySubscription(
      userId,
      companyId,
      false,
    );
  }

  async getSubscriptionCompanies(
    userId: number,
  ): Promise<SubscriptionCompany[]> {
    return await this.subscriptionRepository.findUserCompanySubscriptions(
      userId,
    );
  }

  async isCompanySubscribed(
    userId: number,
    companyId: number,
  ): Promise<boolean> {
    const subscription =
      await this.subscriptionRepository.findActiveCompanySubscription(
        userId,
        companyId,
      );
    return !!subscription;
  }

  async getCompanySubscribers(companyId: number) {
    return await this.subscriptionRepository.findCompanySubscribers(companyId);
  }

  async subscribeIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void> {
    const indicatorGroup =
      await this.subscriptionRepository.findIndicatorGroupByBaseNameAndCountry(
        baseName,
        country,
      );

    if (!indicatorGroup) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    await this.subscriptionRepository.upsertIndicatorGroupSubscription(
      userId,
      baseName,
      country,
      true,
    );
  }

  async unsubscribeIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void> {
    const subscription =
      await this.subscriptionRepository.findIndicatorGroupSubscription(
        userId,
        baseName,
        country,
      );

    if (!subscription || !subscription.isActive) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    await this.subscriptionRepository.updateIndicatorGroupSubscription(
      userId,
      baseName,
      country,
      false,
    );
  }

  async getSubscriptionIndicatorGroups(
    userId: number,
  ): Promise<{ baseName: string; country?: string }[]> {
    return await this.subscriptionRepository.findUserIndicatorGroupSubscriptions(
      userId,
    );
  }

  async isIndicatorGroupSubscribed(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<boolean> {
    const subscription =
      await this.subscriptionRepository.findActiveIndicatorGroupSubscription(
        userId,
        baseName,
        country,
      );
    return !!subscription;
  }

  async getIndicatorGroupSubscribers(baseName: string, country: string) {
    return await this.subscriptionRepository.findIndicatorGroupSubscribers(
      baseName,
      country,
    );
  }
}
