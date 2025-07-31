import { COUNTRY_CODE_MAP } from './../common/constants/country-code.constant';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let subscriptionRepository: SubscriptionRepository;

  const mockSubscriptionRepository = {
    findCompanyById: jest.fn(),
    upsertCompanySubscription: jest.fn(),
    findCompanySubscription: jest.fn(),
    updateCompanySubscription: jest.fn(),
    findUserCompanySubscriptions: jest.fn(),
    findActiveCompanySubscription: jest.fn(),
    findCompanySubscribers: jest.fn(),
    findIndicatorGroupByBaseNameAndCountry: jest.fn(),
    upsertIndicatorGroupSubscription: jest.fn(),
    findIndicatorGroupSubscription: jest.fn(),
    updateIndicatorGroupSubscription: jest.fn(),
    findUserIndicatorGroupSubscriptions: jest.fn(),
    findActiveIndicatorGroupSubscription: jest.fn(),
    findIndicatorGroupSubscribers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionRepository,
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    subscriptionRepository = module.get<SubscriptionRepository>(
      SubscriptionRepository,
    );
    jest.clearAllMocks();
  });

  describe('subscribeCompany', () => {
    it('정상적으로 회사 구독', async () => {
      mockSubscriptionRepository.findCompanyById.mockResolvedValue({ id: 1 });
      mockSubscriptionRepository.upsertCompanySubscription.mockResolvedValue(
        {},
      );

      await expect(service.subscribeCompany(1, 1)).resolves.toBeUndefined();

      expect(mockSubscriptionRepository.findCompanyById).toHaveBeenCalledWith(
        1,
      );
      expect(
        mockSubscriptionRepository.upsertCompanySubscription,
      ).toHaveBeenCalledWith(1, 1, true);
    });

    it('존재하지 않는 회사 구독 시 404', async () => {
      mockSubscriptionRepository.findCompanyById.mockResolvedValue(null);

      await expect(service.subscribeCompany(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('unsubscribeCompany', () => {
    it('정상적으로 회사 구독 해제', async () => {
      mockSubscriptionRepository.findCompanySubscription.mockResolvedValue({
        isActive: true,
      });
      mockSubscriptionRepository.updateCompanySubscription.mockResolvedValue(
        {},
      );

      await expect(service.unsubscribeCompany(1, 1)).resolves.toBeUndefined();

      expect(
        mockSubscriptionRepository.findCompanySubscription,
      ).toHaveBeenCalledWith(1, 1);
      expect(
        mockSubscriptionRepository.updateCompanySubscription,
      ).toHaveBeenCalledWith(1, 1, false);
    });

    it('구독 정보가 없거나 이미 해제된 경우 404', async () => {
      mockSubscriptionRepository.findCompanySubscription.mockResolvedValue(
        null,
      );

      await expect(service.unsubscribeCompany(1, 1)).rejects.toThrow(
        NotFoundException,
      );

      mockSubscriptionRepository.findCompanySubscription.mockResolvedValue({
        isActive: false,
      });

      await expect(service.unsubscribeCompany(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getSubscriptionCompanies', () => {
    it('구독 중인 회사 목록 반환', async () => {
      const mockList = [{ id: 1 }, { id: 2 }];
      mockSubscriptionRepository.findUserCompanySubscriptions.mockResolvedValue(
        mockList,
      );

      const result = await service.getSubscriptionCompanies(1);
      expect(result).toEqual(mockList);
      expect(
        mockSubscriptionRepository.findUserCompanySubscriptions,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('isCompanySubscribed', () => {
    it('구독 중이면 true 반환', async () => {
      mockSubscriptionRepository.findActiveCompanySubscription.mockResolvedValue(
        {},
      );

      const result = await service.isCompanySubscribed(1, 1);
      expect(result).toBe(true);
      expect(
        mockSubscriptionRepository.findActiveCompanySubscription,
      ).toHaveBeenCalledWith(1, 1);
    });

    it('구독 중이 아니면 false 반환', async () => {
      mockSubscriptionRepository.findActiveCompanySubscription.mockResolvedValue(
        null,
      );

      const result = await service.isCompanySubscribed(1, 1);
      expect(result).toBe(false);
    });
  });

  describe('subscribeIndicatorGroup', () => {
    it('정상적으로 지표 그룹 구독', async () => {
      mockSubscriptionRepository.findIndicatorGroupByBaseNameAndCountry.mockResolvedValue(
        {},
      );
      mockSubscriptionRepository.upsertIndicatorGroupSubscription.mockResolvedValue(
        {},
      );

      await expect(
        service.subscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).resolves.toBeUndefined();

      expect(
        mockSubscriptionRepository.findIndicatorGroupByBaseNameAndCountry,
      ).toHaveBeenCalledWith('CPI', 'USA');
      expect(
        mockSubscriptionRepository.upsertIndicatorGroupSubscription,
      ).toHaveBeenCalledWith(1, 'CPI', 'USA', true);
    });

    it('존재하지 않는 지표 그룹 구독 시 404', async () => {
      mockSubscriptionRepository.findIndicatorGroupByBaseNameAndCountry.mockResolvedValue(
        null,
      );

      await expect(
        service.subscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('unsubscribeIndicatorGroup', () => {
    it('정상적으로 지표 그룹 구독 해제', async () => {
      mockSubscriptionRepository.findIndicatorGroupSubscription.mockResolvedValue(
        {
          isActive: true,
        },
      );
      mockSubscriptionRepository.updateIndicatorGroupSubscription.mockResolvedValue(
        {},
      );

      await expect(
        service.unsubscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).resolves.toBeUndefined();

      expect(
        mockSubscriptionRepository.findIndicatorGroupSubscription,
      ).toHaveBeenCalledWith(1, 'CPI', 'USA');
      expect(
        mockSubscriptionRepository.updateIndicatorGroupSubscription,
      ).toHaveBeenCalledWith(1, 'CPI', 'USA', false);
    });

    it('구독 정보가 없거나 이미 해제된 경우 404', async () => {
      mockSubscriptionRepository.findIndicatorGroupSubscription.mockResolvedValue(
        null,
      );

      await expect(
        service.unsubscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).rejects.toThrow(NotFoundException);

      mockSubscriptionRepository.findIndicatorGroupSubscription.mockResolvedValue(
        {
          isActive: false,
        },
      );

      await expect(
        service.unsubscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSubscriptionIndicatorGroups', () => {
    it('구독 중인 지표 그룹 목록 반환', async () => {
      const mockList = [{ baseName: 'CPI', country: 'USA' }];
      mockSubscriptionRepository.findUserIndicatorGroupSubscriptions.mockResolvedValue(
        mockList,
      );

      const result = await service.getSubscriptionIndicatorGroups(1);
      expect(result).toEqual(mockList);
      expect(
        mockSubscriptionRepository.findUserIndicatorGroupSubscriptions,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('isIndicatorGroupSubscribed', () => {
    it('구독 중이면 true 반환', async () => {
      mockSubscriptionRepository.findActiveIndicatorGroupSubscription.mockResolvedValue(
        {},
      );

      const result = await service.isIndicatorGroupSubscribed(
        1,
        'CPI',
        COUNTRY_CODE_MAP.USA,
      );
      expect(result).toBe(true);
      expect(
        mockSubscriptionRepository.findActiveIndicatorGroupSubscription,
      ).toHaveBeenCalledWith(1, 'CPI', 'USA');
    });

    it('구독 중이 아니면 false 반환', async () => {
      mockSubscriptionRepository.findActiveIndicatorGroupSubscription.mockResolvedValue(
        null,
      );

      const result = await service.isIndicatorGroupSubscribed(
        1,
        'CPI',
        COUNTRY_CODE_MAP.USA,
      );
      expect(result).toBe(false);
    });
  });
});
