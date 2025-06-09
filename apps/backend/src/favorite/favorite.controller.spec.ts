import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { COUNTRY_CODE_MAP } from '../common/constants/country-code.constant';
import { RequestWithUser } from '../common/types/request-with-user';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let favoritesService: FavoriteService;

  // 회사/지표 그룹 단위 함수만 남긴 목킹
  const mockFavoritesService = {
    getAllFavorites: jest.fn(),
    addFavoriteCompany: jest.fn(),
    removeFavoriteCompany: jest.fn(),
    addFavoriteIndicatorGroup: jest.fn(),
    removeFavoriteIndicatorGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    favoritesService = module.get<FavoriteService>(FavoriteService);
    jest.clearAllMocks();
  });

  it('FavoriteController가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFavorites', () => {
    it('회사/지표 그룹 즐겨찾기 통합 조회', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;
      const mockFavorites = {
        companies: [{ id: 1, company: { name: 'Apple' } }],
        indicatorGroups: [{ baseName: 'CPI', country: COUNTRY_CODE_MAP.USA }],
      };
      mockFavoritesService.getAllFavorites.mockResolvedValue(mockFavorites);
      const result = await controller.getAllFavorites(req);
      expect(mockFavoritesService.getAllFavorites).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFavorites);
    });
  });

  describe('addFavoriteCompany', () => {
    it('회사 즐겨찾기 추가', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;
      const companyId = 10;
      const mockResponse = { id: 1 };
      mockFavoritesService.addFavoriteCompany.mockResolvedValue(mockResponse);
      const result = await controller.addFavoriteCompany(req, {
        companyId,
      });
      expect(mockFavoritesService.addFavoriteCompany).toHaveBeenCalledWith(
        1,
        companyId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeFavoriteCompany', () => {
    it('회사 즐겨찾기 해제', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;
      const companyId = 10;
      const mockResponse = { id: 1 };
      mockFavoritesService.removeFavoriteCompany.mockResolvedValue(
        mockResponse,
      );
      const result = await controller.removeFavoriteCompany(req, {
        companyId,
      });
      expect(mockFavoritesService.removeFavoriteCompany).toHaveBeenCalledWith(
        1,
        companyId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addFavoriteIndicatorGroup', () => {
    it('지표 그룹 즐겨찾기 추가', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;
      const body = { baseName: 'CPI', country: COUNTRY_CODE_MAP.USA };
      const mockResponse = { id: 2 };
      mockFavoritesService.addFavoriteIndicatorGroup.mockResolvedValue(
        mockResponse,
      );
      const result = await controller.addFavoriteIndicatorGroup(req, body);
      expect(
        mockFavoritesService.addFavoriteIndicatorGroup,
      ).toHaveBeenCalledWith(1, 'CPI', 'USA');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeFavoriteIndicatorGroup', () => {
    it('지표 그룹 즐겨찾기 해제', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;
      const body = { baseName: 'CPI', country: COUNTRY_CODE_MAP.USA };
      const mockResponse = { id: 2 };
      mockFavoritesService.removeFavoriteIndicatorGroup.mockResolvedValue(
        mockResponse,
      );
      const result = await controller.removeFavoriteIndicatorGroup(req, body);
      expect(
        mockFavoritesService.removeFavoriteIndicatorGroup,
      ).toHaveBeenCalledWith(1, 'CPI', 'USA');
      expect(result).toEqual(mockResponse);
    });
  });
});
