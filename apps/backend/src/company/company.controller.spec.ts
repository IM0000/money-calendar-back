import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { RequestWithUser } from '../common/types/request-with-user';

describe('CompaniesController', () => {
  let controller: CompanyController;
  let companiesService: CompanyService;

  // CompaniesService 모킹
  const mockCompaniesService = {
    getCompanyEarnings: jest.fn(),
    getCompanyDividends: jest.fn(),
  };

  // 테스트 데이터
  const mockCompanyId = 1;
  const mockPage = 1;
  const mockLimit = 5;
  const mockUserId = 1;

  // 모의 Request 객체
  const mockRequest = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    companiesService = module.get<CompanyService>(CompanyService);

    // 각 테스트 전에 mock 함수들 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCompanyEarnings', () => {
    it('인증된 사용자로 회사의 실적 정보를 조회해야 합니다', async () => {
      // Mock 반환 데이터 설정
      const mockResponse = {
        items: [
          {
            id: 1,
            companyId: mockCompanyId,
            releaseDate: 1625097600000,
            isFavorite: true,
            hasNotification: false,
          },
        ],
        pagination: {
          total: 1,
          page: mockPage,
          limit: mockLimit,
          totalPages: 1,
        },
      };

      // Mock 함수 구현
      mockCompaniesService.getCompanyEarnings.mockResolvedValue(mockResponse);

      // 컨트롤러 메서드 호출
      const result = await controller.getCompanyEarnings(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockRequest as RequestWithUser,
      );

      // 테스트 검증
      expect(mockCompaniesService.getCompanyEarnings).toHaveBeenCalledWith(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockUserId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCompanyDividends', () => {
    it('인증된 사용자로 회사의 배당 정보를 조회해야 합니다', async () => {
      // Mock 반환 데이터 설정
      const mockResponse = {
        items: [
          {
            id: 1,
            companyId: mockCompanyId,
            exDividendDate: 1625097600000,
            paymentDate: 1627776000000,
            isFavorite: true,
            hasNotification: false,
          },
        ],
        pagination: {
          total: 1,
          page: mockPage,
          limit: mockLimit,
          totalPages: 1,
        },
      };

      // Mock 함수 구현
      mockCompaniesService.getCompanyDividends.mockResolvedValue(mockResponse);

      // 컨트롤러 메서드 호출
      const result = await controller.getCompanyDividends(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockRequest as RequestWithUser,
      );

      // 테스트 검증
      expect(mockCompaniesService.getCompanyDividends).toHaveBeenCalledWith(
        mockCompanyId,
        mockPage,
        mockLimit,
        mockUserId,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
