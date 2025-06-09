import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionCompanyDto } from './dto/subscription-company.dto';
import { SubscriptionIndicatorGroupDto } from './dto/subscription-indicator-group.dto';
import { RequestWithUser } from '../common/types/request-with-user';

// RequestWithUser mock 생성 함수
const mockReq = (userId = 1): RequestWithUser =>
  ({
    user: {
      id: userId,
      email: 'test@example.com',
      password: null,
      nickname: null,
      verified: false,
      currentHashedRefreshToken: null,
      oauthAccounts: [],
      notificationSettings: null,
      notifications: [],
      favoriteCompanies: [],
      favoriteIndicatorGroups: [],
      subscriptionCompanies: [],
      subscriptionIndicatorGroups: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as any);

// DTO mock
const companyDto: SubscriptionCompanyDto = { companyId: 1 };
const indicatorGroupDto: SubscriptionIndicatorGroupDto = {
  baseName: 'CPI',
  country: 'USA',
};

// 서비스 mock
const mockService = {
  subscribeCompany: jest.fn(),
  unsubscribeCompany: jest.fn(),
  getSubscriptionCompanies: jest.fn(),
  isCompanySubscribed: jest.fn(),
  subscribeIndicatorGroup: jest.fn(),
  unsubscribeIndicatorGroup: jest.fn(),
  getSubscriptionIndicatorGroups: jest.fn(),
  isIndicatorGroupSubscribed: jest.fn(),
};

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: typeof mockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [{ provide: SubscriptionService, useValue: mockService }],
    }).compile();
    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get(SubscriptionService);
    jest.clearAllMocks();
  });

  describe('subscribeCompany', () => {
    it('회사 구독 성공', async () => {
      service.subscribeCompany.mockResolvedValue(undefined);
      await expect(
        controller.subscribeCompany(mockReq(), companyDto),
      ).resolves.toBeUndefined();
      expect(service.subscribeCompany).toBeCalledWith(1, 1);
    });
  });

  describe('unsubscribeCompany', () => {
    it('회사 구독 해제 성공', async () => {
      service.unsubscribeCompany.mockResolvedValue(undefined);
      await expect(
        controller.unsubscribeCompany(mockReq(), companyDto),
      ).resolves.toBeUndefined();
      expect(service.unsubscribeCompany).toBeCalledWith(1, 1);
    });
  });

  describe('getSubscriptionCompanies', () => {
    it('구독 회사 목록 반환', async () => {
      const mockList = [{ id: 1 }, { id: 2 }];
      service.getSubscriptionCompanies.mockResolvedValue(mockList);
      const result = await controller.getSubscriptionCompanies(mockReq());
      expect(result).toEqual(mockList);
      expect(service.getSubscriptionCompanies).toBeCalledWith(1);
    });
  });

  describe('isCompanySubscribed', () => {
    it('구독 중이면 true 반환', async () => {
      service.isCompanySubscribed.mockResolvedValue(true);
      const result = await controller.isCompanySubscribed(
        mockReq(),
        companyDto,
      );
      expect(result).toBe(true);
      expect(service.isCompanySubscribed).toBeCalledWith(1, 1);
    });
    it('구독 중이 아니면 false 반환', async () => {
      service.isCompanySubscribed.mockResolvedValue(false);
      const result = await controller.isCompanySubscribed(
        mockReq(),
        companyDto,
      );
      expect(result).toBe(false);
    });
  });

  describe('subscribeIndicatorGroup', () => {
    it('지표 그룹 구독 성공', async () => {
      service.subscribeIndicatorGroup.mockResolvedValue(undefined);
      await expect(
        controller.subscribeIndicatorGroup(mockReq(), indicatorGroupDto),
      ).resolves.toBeUndefined();
      expect(service.subscribeIndicatorGroup).toBeCalledWith(1, 'CPI', 'USA');
    });
  });

  describe('unsubscribeIndicatorGroup', () => {
    it('지표 그룹 구독 해제 성공', async () => {
      service.unsubscribeIndicatorGroup.mockResolvedValue(undefined);
      await expect(
        controller.unsubscribeIndicatorGroup(mockReq(), indicatorGroupDto),
      ).resolves.toBeUndefined();
      expect(service.unsubscribeIndicatorGroup).toBeCalledWith(1, 'CPI', 'USA');
    });
  });

  describe('getSubscriptionIndicatorGroups', () => {
    it('구독 지표 그룹 목록 반환', async () => {
      const mockList = [{ baseName: 'CPI', country: 'USA' }];
      service.getSubscriptionIndicatorGroups.mockResolvedValue(mockList);
      const result = await controller.getSubscriptionIndicatorGroups(mockReq());
      expect(result).toEqual(mockList);
      expect(service.getSubscriptionIndicatorGroups).toBeCalledWith(1);
    });
  });

  describe('isIndicatorGroupSubscribed', () => {
    it('구독 중이면 true 반환', async () => {
      service.isIndicatorGroupSubscribed.mockResolvedValue(true);
      const result = await controller.isIndicatorGroupSubscribed(
        mockReq(),
        indicatorGroupDto,
      );
      expect(result).toBe(true);
      expect(service.isIndicatorGroupSubscribed).toBeCalledWith(
        1,
        'CPI',
        'USA',
      );
    });
    it('구독 중이 아니면 false 반환', async () => {
      service.isIndicatorGroupSubscribed.mockResolvedValue(false);
      const result = await controller.isIndicatorGroupSubscribed(
        mockReq(),
        indicatorGroupDto,
      );
      expect(result).toBe(false);
    });
  });
});
