import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Request } from 'express';

// RequestWithUser 인터페이스 정의
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let favoritesService: FavoritesService;

  // FavoritesService 모킹
  const mockFavoritesService = {
    getAllFavorites: jest.fn(),
    getFavoriteCalendarEvents: jest.fn(),
    addFavoriteEarnings: jest.fn(),
    removeFavoriteEarnings: jest.fn(),
    addFavoriteDividends: jest.fn(),
    removeFavoriteDividends: jest.fn(),
    addFavoriteIndicator: jest.fn(),
    removeFavoriteIndicator: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    favoritesService = module.get<FavoritesService>(FavoritesService);

    // 각 테스트 전에 모든 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFavorites', () => {
    it('사용자의 모든 즐겨찾기를 반환해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const mockFavorites = {
        earnings: [{ id: 1, company: { name: 'Apple' } }],
        dividends: [{ id: 1, company: { name: 'Microsoft' } }],
        economicIndicators: [{ id: 1, country: 'US' }],
      };

      mockFavoritesService.getAllFavorites.mockResolvedValue(mockFavorites);

      const result = await controller.getAllFavorites(req);

      expect(mockFavoritesService.getAllFavorites).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFavorites);
    });
  });

  describe('getFavoriteCalendarEvents', () => {
    it('사용자의 즐겨찾기 캘린더 이벤트를 반환해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const startDate = '2024-01-01';
      const endDate = '2024-01-01';

      const mockEvents = {
        earnings: [{ id: 1, company: { name: 'Apple' } }],
        dividends: [{ id: 1, company: { name: 'Microsoft' } }],
        economicIndicators: [{ id: 1, country: 'US' }],
      };

      mockFavoritesService.getFavoriteCalendarEvents.mockResolvedValue(
        mockEvents,
      );

      const result = await controller.getFavoriteCalendarEvents(
        req,
        startDate,
        endDate,
      );

      expect(
        mockFavoritesService.getFavoriteCalendarEvents,
      ).toHaveBeenCalledWith(
        1,
        new Date(startDate).getTime(),
        new Date(endDate).getTime(),
      );
      expect(result).toEqual(mockEvents);
    });
  });

  describe('addFavoriteEarnings', () => {
    it('즐겨찾기에 실적 정보를 추가해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const earningsId = 1;
      const mockResponse = { message: '즐겨찾기에 성공적으로 추가되었습니다.' };

      mockFavoritesService.addFavoriteEarnings.mockResolvedValue(mockResponse);

      const result = await controller.addFavoriteEarnings(req, earningsId);

      expect(mockFavoritesService.addFavoriteEarnings).toHaveBeenCalledWith(
        1,
        earningsId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeFavoriteEarnings', () => {
    it('즐겨찾기에서 실적 정보를 제거해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const earningsId = 1;
      const mockResponse = {
        message: '즐겨찾기에서 성공적으로 제거되었습니다.',
      };

      mockFavoritesService.removeFavoriteEarnings.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.removeFavoriteEarnings(req, earningsId);

      expect(mockFavoritesService.removeFavoriteEarnings).toHaveBeenCalledWith(
        1,
        earningsId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addFavoriteDividends', () => {
    it('즐겨찾기에 배당 정보를 추가해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const dividendId = 1;
      const mockResponse = { message: '즐겨찾기에 성공적으로 추가되었습니다.' };

      mockFavoritesService.addFavoriteDividends.mockResolvedValue(mockResponse);

      const result = await controller.addFavoriteDividends(req, dividendId);

      expect(mockFavoritesService.addFavoriteDividends).toHaveBeenCalledWith(
        1,
        dividendId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeFavoriteDividends', () => {
    it('즐겨찾기에서 배당 정보를 제거해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const dividendId = 1;
      const mockResponse = {
        message: '즐겨찾기에서 성공적으로 제거되었습니다.',
      };

      mockFavoritesService.removeFavoriteDividends.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.removeFavoriteDividends(req, dividendId);

      expect(mockFavoritesService.removeFavoriteDividends).toHaveBeenCalledWith(
        1,
        dividendId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addFavoriteIndicator', () => {
    it('즐겨찾기에 경제지표를 추가해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const indicatorId = 1;
      const mockResponse = { message: '즐겨찾기에 성공적으로 추가되었습니다.' };

      mockFavoritesService.addFavoriteIndicator.mockResolvedValue(mockResponse);

      const result = await controller.addFavoriteIndicator(req, indicatorId);

      expect(mockFavoritesService.addFavoriteIndicator).toHaveBeenCalledWith(
        1,
        indicatorId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeFavoriteIndicator', () => {
    it('즐겨찾기에서 경제지표를 제거해야 합니다', async () => {
      // Mock Request 객체
      const req = {
        user: { id: 1, email: 'test@example.com' },
      } as RequestWithUser;

      const indicatorId = 1;
      const mockResponse = {
        message: '즐겨찾기에서 성공적으로 제거되었습니다.',
      };

      mockFavoritesService.removeFavoriteIndicator.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.removeFavoriteIndicator(req, indicatorId);

      expect(mockFavoritesService.removeFavoriteIndicator).toHaveBeenCalledWith(
        1,
        indicatorId,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
