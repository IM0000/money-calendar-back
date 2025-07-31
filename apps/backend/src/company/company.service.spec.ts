import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepository: CompanyRepository;

  const mockCompanyRepository = {
    getCompanyEarnings: jest.fn(),
    getCompanyEarningsCount: jest.fn(),
    getCompanyDividends: jest.fn(),
    getCompanyDividendsCount: jest.fn(),
    getFavoriteCompany: jest.fn(),
    getCompanySubscription: jest.fn(),
  };

  const mockCompanyId = 1;
  const mockPage = 1;
  const mockLimit = 10;
  const mockUserId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCompanyEarnings', () => {
    it('회사 ID로 실적 정보를 조회해야 합니다', async () => {
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
          country: 'USA',
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
      const skip = (mockPage - 1) * mockLimit;

      mockCompanyRepository.getCompanyEarnings.mockResolvedValue(
        mockEarningsItems,
      );
      mockCompanyRepository.getCompanyEarningsCount.mockResolvedValue(
        mockTotal,
      );

      const result = await service.getCompanyEarnings(
        mockCompanyId,
        mockPage,
        mockLimit,
      );

      expect(mockCompanyRepository.getCompanyEarnings).toHaveBeenCalledWith(
        mockCompanyId,
        skip,
        mockLimit,
      );

      expect(
        mockCompanyRepository.getCompanyEarningsCount,
      ).toHaveBeenCalledWith(mockCompanyId);

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

    it('사용자 ID가 제공되면 회사 단위 즐겨찾기와 구독 정보를 포함해야 합니다', async () => {
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
          country: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockFavoriteCompany = { id: 1, isActive: true };
      const mockSubscriptionCompany = { id: 1, isActive: true };
      const mockTotal = 1;
      const skip = (mockPage - 1) * mockLimit;

      mockCompanyRepository.getCompanyEarnings.mockResolvedValue(
        mockEarningsItems,
      );
      mockCompanyRepository.getCompanyEarningsCount.mockResolvedValue(
        mockTotal,
      );
      mockCompanyRepository.getFavoriteCompany.mockResolvedValue(
        mockFavoriteCompany,
      );
      mockCompanyRepository.getCompanySubscription.mockResolvedValue(
        mockSubscriptionCompany,
      );

      const result = await service.getCompanyEarnings(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockUserId,
      );

      expect(mockCompanyRepository.getFavoriteCompany).toHaveBeenCalledWith(
        mockUserId,
        mockCompanyId,
      );

      expect(mockCompanyRepository.getCompanySubscription).toHaveBeenCalledWith(
        mockUserId,
        mockCompanyId,
      );

      expect(result.items[0]).toHaveProperty('isFavorite', true);
      expect(result.items[0]).toHaveProperty('hasNotification', true);
    });
  });

  describe('getCompanyDividends', () => {
    it('회사 ID로 배당 정보를 조회해야 합니다', async () => {
      const mockDividendItems = [
        {
          id: 1,
          companyId: mockCompanyId,
          exDividendDate: BigInt(1625097600000),
          paymentDate: BigInt(1627776000000),
          dividendAmount: '0.88',
          previousDividendAmount: '0.82',
          dividendYield: '0.5',
          country: 'USA',
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
          country: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockTotal = 2;
      const skip = (mockPage - 1) * mockLimit;

      mockCompanyRepository.getCompanyDividends.mockResolvedValue(
        mockDividendItems,
      );
      mockCompanyRepository.getCompanyDividendsCount.mockResolvedValue(
        mockTotal,
      );

      const result = await service.getCompanyDividends(
        mockCompanyId,
        mockPage,
        mockLimit,
      );

      expect(mockCompanyRepository.getCompanyDividends).toHaveBeenCalledWith(
        mockCompanyId,
        skip,
        mockLimit,
      );

      expect(
        mockCompanyRepository.getCompanyDividendsCount,
      ).toHaveBeenCalledWith(mockCompanyId);

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

    it('사용자 ID가 제공되면 회사 단위 즐겨찾기와 구독 정보를 포함해야 합니다', async () => {
      const mockDividendItems = [
        {
          id: 1,
          companyId: mockCompanyId,
          exDividendDate: BigInt(1625097600000),
          paymentDate: BigInt(1627776000000),
          dividendAmount: '0.88',
          previousDividendAmount: '0.82',
          dividendYield: '0.5',
          country: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockFavoriteCompany = { id: 1, isActive: true };
      const mockSubscriptionCompany = { id: 1, isActive: true };
      const mockTotal = 1;
      const skip = (mockPage - 1) * mockLimit;

      mockCompanyRepository.getCompanyDividends.mockResolvedValue(
        mockDividendItems,
      );
      mockCompanyRepository.getCompanyDividendsCount.mockResolvedValue(
        mockTotal,
      );
      mockCompanyRepository.getFavoriteCompany.mockResolvedValue(
        mockFavoriteCompany,
      );
      mockCompanyRepository.getCompanySubscription.mockResolvedValue(
        mockSubscriptionCompany,
      );

      const result = await service.getCompanyDividends(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockUserId,
      );

      expect(mockCompanyRepository.getFavoriteCompany).toHaveBeenCalledWith(
        mockUserId,
        mockCompanyId,
      );

      expect(mockCompanyRepository.getCompanySubscription).toHaveBeenCalledWith(
        mockUserId,
        mockCompanyId,
      );

      expect(result.items[0]).toHaveProperty('isFavorite', true);
      expect(result.items[0]).toHaveProperty('hasNotification', true);
    });
  });
});
