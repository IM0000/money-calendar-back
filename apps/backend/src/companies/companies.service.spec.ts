import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prismaService: PrismaService;

  // PrismaService 목킹
  const mockPrismaService = {
    earnings: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    dividend: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    favoriteEarnings: {
      findMany: jest.fn(),
    },
    favoriteDividends: {
      findMany: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
    },
  };

  // 테스트 데이터
  const mockCompanyId = 1;
  const mockPage = 1;
  const mockLimit = 10;
  const mockUserId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prismaService = module.get<PrismaService>(PrismaService);

    // 각 테스트 전에 mock 함수들 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCompanyEarnings', () => {
    it('회사 ID로 실적 정보를 조회해야 합니다', async () => {
      // Mock 데이터 설정
      const mockEarningsItems = [
        {
          id: 1,
          companyId: mockCompanyId,
          releaseDate: BigInt(1625097600000),
          releaseTiming: 'BMO',
          actualEPS: '1.5',
          forecastEPS: '1.4',
          previousEPS: '1.3',
          actualRevenue: '10000000',
          forecastRevenue: '9500000',
          previousRevenue: '9000000',
          country: 'US',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          companyId: mockCompanyId,
          releaseDate: BigInt(1617235200000),
          releaseTiming: 'AMC',
          actualEPS: '1.7',
          forecastEPS: '1.6',
          previousEPS: '1.5',
          actualRevenue: '11000000',
          forecastRevenue: '10500000',
          previousRevenue: '10000000',
          country: 'US',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockTotal = 2;

      // Mock 함수 구현
      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarningsItems);
      mockPrismaService.earnings.count.mockResolvedValue(mockTotal);

      // 서비스 메서드 호출
      const result = await service.getCompanyEarnings(
        mockCompanyId,
        mockPage,
        mockLimit,
      );

      // 테스트 검증
      expect(mockPrismaService.earnings.findMany).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId },
        skip: 0,
        take: mockLimit,
        orderBy: { releaseDate: 'desc' },
      });

      expect(mockPrismaService.earnings.count).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId },
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toEqual({
        total: mockTotal,
        page: mockPage,
        limit: mockLimit,
        totalPages: Math.ceil(mockTotal / mockLimit),
      });
      expect(result.items.length).toBe(mockEarningsItems.length);
    });

    it('사용자 ID가 제공되면 즐겨찾기와 알림 정보를 포함해야 합니다', async () => {
      // Mock 데이터 설정
      const mockEarningsItems = [
        {
          id: 1,
          companyId: mockCompanyId,
          releaseDate: BigInt(1625097600000),
          releaseTiming: 'BMO',
          actualEPS: '1.5',
          forecastEPS: '1.4',
          previousEPS: '1.3',
          actualRevenue: '10000000',
          forecastRevenue: '9500000',
          previousRevenue: '9000000',
          country: 'US',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockUserFavorites = [{ earningsId: 1 }];
      const mockUserNotifications = [{ contentId: 1 }];
      const mockTotal = 1;

      // Mock 함수 구현
      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarningsItems);
      mockPrismaService.earnings.count.mockResolvedValue(mockTotal);
      mockPrismaService.favoriteEarnings.findMany.mockResolvedValue(
        mockUserFavorites,
      );
      mockPrismaService.notification.findMany.mockResolvedValue(
        mockUserNotifications,
      );

      // 서비스 메서드 호출
      const result = await service.getCompanyEarnings(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockUserId,
      );

      // 테스트 검증
      expect(mockPrismaService.favoriteEarnings.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          earningsId: {
            in: expect.any(Array),
          },
        },
        select: {
          earningsId: true,
        },
      });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          contentType: ContentType.EARNINGS,
          contentId: {
            in: expect.any(Array),
          },
          read: false,
        },
        select: {
          contentId: true,
        },
      });

      expect(result.items[0]).toHaveProperty('isFavorite', true);
      expect(result.items[0]).toHaveProperty('hasNotification', true);
    });
  });

  describe('getCompanyDividends', () => {
    it('회사 ID로 배당 정보를 조회해야 합니다', async () => {
      // Mock 데이터 설정
      const mockDividendItems = [
        {
          id: 1,
          companyId: mockCompanyId,
          exDividendDate: BigInt(1625097600000),
          paymentDate: BigInt(1627776000000),
          dividendAmount: '0.88',
          previousDividendAmount: '0.82',
          dividendYield: '0.5',
          country: 'US',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          companyId: mockCompanyId,
          exDividendDate: BigInt(1617235200000),
          paymentDate: BigInt(1619827200000),
          dividendAmount: '0.82',
          previousDividendAmount: '0.77',
          dividendYield: '0.48',
          country: 'US',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockTotal = 2;

      // Mock 함수 구현
      mockPrismaService.dividend.findMany.mockResolvedValue(mockDividendItems);
      mockPrismaService.dividend.count.mockResolvedValue(mockTotal);

      // 서비스 메서드 호출
      const result = await service.getCompanyDividends(
        mockCompanyId,
        mockPage,
        mockLimit,
      );

      // 테스트 검증
      expect(mockPrismaService.dividend.findMany).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId },
        skip: 0,
        take: mockLimit,
        orderBy: { exDividendDate: 'desc' },
      });

      expect(mockPrismaService.dividend.count).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId },
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toEqual({
        total: mockTotal,
        page: mockPage,
        limit: mockLimit,
        totalPages: Math.ceil(mockTotal / mockLimit),
      });
      expect(result.items.length).toBe(mockDividendItems.length);
    });

    it('사용자 ID가 제공되면 즐겨찾기와 알림 정보를 포함해야 합니다', async () => {
      // Mock 데이터 설정
      const mockDividendItems = [
        {
          id: 1,
          companyId: mockCompanyId,
          exDividendDate: BigInt(1625097600000),
          paymentDate: BigInt(1627776000000),
          dividendAmount: '0.88',
          previousDividendAmount: '0.82',
          dividendYield: '0.5',
          country: 'US',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockUserFavorites = [{ dividendId: 1 }];
      const mockUserNotifications = [{ contentId: 1 }];
      const mockTotal = 1;

      // Mock 함수 구현
      mockPrismaService.dividend.findMany.mockResolvedValue(mockDividendItems);
      mockPrismaService.dividend.count.mockResolvedValue(mockTotal);
      mockPrismaService.favoriteDividends.findMany.mockResolvedValue(
        mockUserFavorites,
      );
      mockPrismaService.notification.findMany.mockResolvedValue(
        mockUserNotifications,
      );

      // 서비스 메서드 호출
      const result = await service.getCompanyDividends(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockUserId,
      );

      // 테스트 검증
      expect(mockPrismaService.favoriteDividends.findMany).toHaveBeenCalledWith(
        {
          where: {
            userId: mockUserId,
            dividendId: {
              in: expect.any(Array),
            },
          },
          select: {
            dividendId: true,
          },
        },
      );

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          contentType: ContentType.DIVIDEND,
          contentId: {
            in: expect.any(Array),
          },
          read: false,
        },
        select: {
          contentId: true,
        },
      });

      expect(result.items[0]).toHaveProperty('isFavorite', true);
      expect(result.items[0]).toHaveProperty('hasNotification', true);
    });
  });
});
