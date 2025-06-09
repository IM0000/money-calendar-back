import { COUNTRY_CODE_MAP } from './../common/constants/country-code.constant';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    company: {
      findUnique: jest.fn(),
    },
    subscriptionCompany: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    economicIndicator: {
      findFirst: jest.fn(),
    },
    subscriptionIndicatorGroup: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('subscribeCompany', () => {
    it('정상적으로 회사 구독', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.subscriptionCompany.upsert.mockResolvedValue({});

      await expect(service.subscribeCompany(1, 1)).resolves.toBeUndefined();

      expect(mockPrismaService.subscriptionCompany.upsert).toHaveBeenCalledWith(
        {
          where: { userId_companyId: { userId: 1, companyId: 1 } },
          update: { isActive: true },
          create: { userId: 1, companyId: 1, isActive: true },
        },
      );
    });

    it('존재하지 않는 회사 구독 시 404', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue(null);

      await expect(service.subscribeCompany(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('unsubscribeCompany', () => {
    it('정상적으로 회사 구독 해제', async () => {
      mockPrismaService.subscriptionCompany.findUnique.mockResolvedValue({
        isActive: true,
      });
      mockPrismaService.subscriptionCompany.update.mockResolvedValue({});

      await expect(service.unsubscribeCompany(1, 1)).resolves.toBeUndefined();

      expect(mockPrismaService.subscriptionCompany.update).toHaveBeenCalledWith(
        {
          where: { userId_companyId: { userId: 1, companyId: 1 } },
          data: { isActive: false },
        },
      );
    });

    it('구독 정보가 없거나 이미 해제된 경우 404', async () => {
      mockPrismaService.subscriptionCompany.findUnique.mockResolvedValue(null);

      await expect(service.unsubscribeCompany(1, 1)).rejects.toThrow(
        NotFoundException,
      );

      mockPrismaService.subscriptionCompany.findUnique.mockResolvedValue({
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
      mockPrismaService.subscriptionCompany.findMany.mockResolvedValue(
        mockList,
      );

      const result = await service.getSubscriptionCompanies(1);
      expect(result).toEqual(mockList);
    });
  });

  describe('isCompanySubscribed', () => {
    it('구독 중이면 true 반환', async () => {
      mockPrismaService.subscriptionCompany.findUnique.mockResolvedValue({});

      const result = await service.isCompanySubscribed(1, 1);
      expect(result).toBe(true);
    });

    it('구독 중이 아니면 false 반환', async () => {
      mockPrismaService.subscriptionCompany.findUnique.mockResolvedValue(null);

      const result = await service.isCompanySubscribed(1, 1);
      expect(result).toBe(false);
    });
  });

  describe('subscribeIndicatorGroup', () => {
    it('정상적으로 지표 그룹 구독', async () => {
      mockPrismaService.economicIndicator.findFirst.mockResolvedValue({});
      mockPrismaService.subscriptionIndicatorGroup.upsert.mockResolvedValue({});

      await expect(
        service.subscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).resolves.toBeUndefined();

      expect(
        mockPrismaService.subscriptionIndicatorGroup.upsert,
      ).toHaveBeenCalledWith({
        where: {
          userId_baseName_country: {
            userId: 1,
            baseName: 'CPI',
            country: 'USA',
          },
        },
        update: { isActive: true },
        create: { userId: 1, baseName: 'CPI', country: 'USA', isActive: true },
      });
    });

    it('존재하지 않는 지표 그룹 구독 시 404', async () => {
      mockPrismaService.economicIndicator.findFirst.mockResolvedValue(null);

      await expect(
        service.subscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('unsubscribeIndicatorGroup', () => {
    it('정상적으로 지표 그룹 구독 해제', async () => {
      mockPrismaService.subscriptionIndicatorGroup.findUnique.mockResolvedValue(
        {
          isActive: true,
        },
      );
      mockPrismaService.subscriptionIndicatorGroup.update.mockResolvedValue({});

      await expect(
        service.unsubscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).resolves.toBeUndefined();

      expect(
        mockPrismaService.subscriptionIndicatorGroup.update,
      ).toHaveBeenCalledWith({
        where: {
          userId_baseName_country: {
            userId: 1,
            baseName: 'CPI',
            country: 'USA',
          },
        },
        data: { isActive: false },
      });
    });

    it('구독 정보가 없거나 이미 해제된 경우 404', async () => {
      mockPrismaService.subscriptionIndicatorGroup.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.unsubscribeIndicatorGroup(1, 'CPI', COUNTRY_CODE_MAP.USA),
      ).rejects.toThrow(NotFoundException);

      mockPrismaService.subscriptionIndicatorGroup.findUnique.mockResolvedValue(
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
      mockPrismaService.subscriptionIndicatorGroup.findMany.mockResolvedValue(
        mockList,
      );

      const result = await service.getSubscriptionIndicatorGroups(1);
      expect(result).toEqual(mockList);
    });
  });

  describe('isIndicatorGroupSubscribed', () => {
    it('구독 중이면 true 반환', async () => {
      mockPrismaService.subscriptionIndicatorGroup.findUnique.mockResolvedValue(
        {},
      );

      const result = await service.isIndicatorGroupSubscribed(
        1,
        'CPI',
        COUNTRY_CODE_MAP.USA,
      );
      expect(result).toBe(true);
    });

    it('구독 중이 아니면 false 반환', async () => {
      mockPrismaService.subscriptionIndicatorGroup.findUnique.mockResolvedValue(
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
