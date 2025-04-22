import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prismaService: PrismaService;

  // PrismaService 목킹
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    earnings: {
      findMany: jest.fn(),
    },
    dividend: {
      findMany: jest.fn(),
    },
    economicIndicator: {
      findMany: jest.fn(),
    },
    favoriteEarnings: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    favoriteDividends: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    favoriteIndicator: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  // 테스트 데이터
  const mockUserId = 1;
  const mockEarningsId = 101;
  const mockDividendId = 201;
  const mockIndicatorId = 301;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    prismaService = module.get<PrismaService>(PrismaService);

    // 각 테스트 전에 모든 모의 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFavorites', () => {
    it('사용자의 모든 즐겨찾기를 반환해야 합니다', async () => {
      const mockUser = {
        id: mockUserId,
        favoriteEarnings: [
          {
            earnings: {
              id: 1,
              company: { id: 1, name: 'Apple', country: 'US' },
              country: 'US',
            },
          },
          {
            earnings: {
              id: 2,
              company: { id: 2, name: 'Samsung', country: 'KR' },
              country: 'KR',
            },
          },
        ],
        favoriteDividends: [
          {
            dividend: {
              id: 1,
              company: { id: 1, name: 'Apple', country: 'US' },
              country: 'US',
              exDividendDate: BigInt(1625097600000),
              paymentDate: BigInt(1625097600000),
            },
          },
        ],
        favoriteIndicators: [
          {
            indicator: {
              id: 1,
              name: 'CPI',
              country: 'US',
              releaseDate: BigInt(1625097600000),
            },
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getAllFavorites(mockUserId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        include: expect.any(Object),
      });

      expect(result).toHaveProperty('earnings');
      expect(result).toHaveProperty('dividends');
      expect(result).toHaveProperty('economicIndicators');
    });

    it('사용자가 존재하지 않으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getAllFavorites(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFavoriteCalendarEvents', () => {
    const startTimestamp = 1625097600000;
    const endTimestamp = 1627776000000;

    it('사용자의 즐겨찾기 일정을 기간별로 반환해야 합니다', async () => {
      const mockEarnings = [
        {
          id: 1,
          companyId: 1,
          company: { name: 'Apple' },
          releaseDate: BigInt(1625097600000),
        },
      ];
      const mockDividends = [
        {
          id: 1,
          companyId: 1,
          company: { name: 'Apple' },
          exDividendDate: BigInt(1625097600000),
          paymentDate: BigInt(1625097600000),
        },
      ];
      const mockIndicators = [
        { id: 1, name: 'CPI', releaseDate: BigInt(1625097600000) },
      ];

      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarnings);
      mockPrismaService.dividend.findMany.mockResolvedValue(mockDividends);
      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockIndicators,
      );

      const result = await service.getFavoriteCalendarEvents(
        mockUserId,
        startTimestamp,
        endTimestamp,
      );

      expect(mockPrismaService.earnings.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          releaseDate: {
            gte: startTimestamp,
            lte: endTimestamp,
          },
          favorites: {
            some: {
              userId: mockUserId,
            },
          },
        }),
        include: { company: true },
      });

      expect(result).toHaveProperty('earnings');
      expect(result).toHaveProperty('dividends');
      expect(result).toHaveProperty('economicIndicators');
    });
  });

  describe('addFavoriteEarnings', () => {
    it('새로운 실적 즐겨찾기를 추가해야 합니다', async () => {
      mockPrismaService.favoriteEarnings.findUnique.mockResolvedValue(null);
      mockPrismaService.favoriteEarnings.create.mockResolvedValue({
        userId: mockUserId,
        earningsId: mockEarningsId,
      });

      const result = await service.addFavoriteEarnings(
        mockUserId,
        mockEarningsId,
      );

      expect(
        mockPrismaService.favoriteEarnings.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          userId_earningsId: {
            userId: mockUserId,
            earningsId: mockEarningsId,
          },
        },
      });

      expect(mockPrismaService.favoriteEarnings.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          earningsId: mockEarningsId,
        },
      });

      expect(result).toEqual({
        message: '즐겨찾기에 성공적으로 추가되었습니다.',
      });
    });

    it('이미 존재하는 실적 즐겨찾기에는 중복 추가되지 않아야 합니다', async () => {
      mockPrismaService.favoriteEarnings.findUnique.mockResolvedValue({
        userId: mockUserId,
        earningsId: mockEarningsId,
      });

      const result = await service.addFavoriteEarnings(
        mockUserId,
        mockEarningsId,
      );

      expect(mockPrismaService.favoriteEarnings.create).not.toHaveBeenCalled();
      expect(result).toEqual({ message: '이미 즐겨찾기에 추가되어 있습니다.' });
    });

    it('에러 발생 시 BadRequestException을 발생시켜야 합니다', async () => {
      mockPrismaService.favoriteEarnings.findUnique.mockRejectedValue(
        new Error('데이터베이스 오류'),
      );

      await expect(
        service.addFavoriteEarnings(mockUserId, mockEarningsId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeFavoriteEarnings', () => {
    it('실적 즐겨찾기를 성공적으로 제거해야 합니다', async () => {
      mockPrismaService.favoriteEarnings.delete.mockResolvedValue({
        userId: mockUserId,
        earningsId: mockEarningsId,
      });

      const result = await service.removeFavoriteEarnings(
        mockUserId,
        mockEarningsId,
      );

      expect(mockPrismaService.favoriteEarnings.delete).toHaveBeenCalledWith({
        where: {
          userId_earningsId: {
            userId: mockUserId,
            earningsId: mockEarningsId,
          },
        },
      });

      expect(result).toEqual({
        message: '즐겨찾기에서 성공적으로 제거되었습니다.',
      });
    });

    it('에러 발생 시 BadRequestException을 발생시켜야 합니다', async () => {
      mockPrismaService.favoriteEarnings.delete.mockRejectedValue(
        new Error('데이터베이스 오류'),
      );

      await expect(
        service.removeFavoriteEarnings(mockUserId, mockEarningsId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('addFavoriteDividends', () => {
    it('새로운 배당 즐겨찾기를 추가해야 합니다', async () => {
      mockPrismaService.favoriteDividends.findUnique.mockResolvedValue(null);
      mockPrismaService.favoriteDividends.create.mockResolvedValue({
        userId: mockUserId,
        dividendId: mockDividendId,
      });

      const result = await service.addFavoriteDividends(
        mockUserId,
        mockDividendId,
      );

      expect(
        mockPrismaService.favoriteDividends.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          userId_dividendId: {
            userId: mockUserId,
            dividendId: mockDividendId,
          },
        },
      });

      expect(mockPrismaService.favoriteDividends.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          dividendId: mockDividendId,
        },
      });

      expect(result).toEqual({
        message: '즐겨찾기에 성공적으로 추가되었습니다.',
      });
    });

    it('이미 존재하는 배당 즐겨찾기에는 중복 추가되지 않아야 합니다', async () => {
      mockPrismaService.favoriteDividends.findUnique.mockResolvedValue({
        userId: mockUserId,
        dividendId: mockDividendId,
      });

      const result = await service.addFavoriteDividends(
        mockUserId,
        mockDividendId,
      );

      expect(mockPrismaService.favoriteDividends.create).not.toHaveBeenCalled();
      expect(result).toEqual({ message: '이미 즐겨찾기에 추가되어 있습니다.' });
    });
  });

  describe('removeFavoriteDividends', () => {
    it('배당 즐겨찾기를 성공적으로 제거해야 합니다', async () => {
      mockPrismaService.favoriteDividends.delete.mockResolvedValue({
        userId: mockUserId,
        dividendId: mockDividendId,
      });

      const result = await service.removeFavoriteDividends(
        mockUserId,
        mockDividendId,
      );

      expect(mockPrismaService.favoriteDividends.delete).toHaveBeenCalledWith({
        where: {
          userId_dividendId: {
            userId: mockUserId,
            dividendId: mockDividendId,
          },
        },
      });

      expect(result).toEqual({
        message: '즐겨찾기에서 성공적으로 제거되었습니다.',
      });
    });
  });

  describe('addFavoriteIndicator', () => {
    it('새로운 경제지표 즐겨찾기를 추가해야 합니다', async () => {
      mockPrismaService.favoriteIndicator.findUnique.mockResolvedValue(null);
      mockPrismaService.favoriteIndicator.create.mockResolvedValue({
        userId: mockUserId,
        indicatorId: mockIndicatorId,
      });

      const result = await service.addFavoriteIndicator(
        mockUserId,
        mockIndicatorId,
      );

      expect(
        mockPrismaService.favoriteIndicator.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          userId_indicatorId: {
            userId: mockUserId,
            indicatorId: mockIndicatorId,
          },
        },
      });

      expect(mockPrismaService.favoriteIndicator.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          indicatorId: mockIndicatorId,
        },
      });

      expect(result).toEqual({
        message: '즐겨찾기에 성공적으로 추가되었습니다.',
      });
    });

    it('이미 존재하는 경제지표 즐겨찾기에는 중복 추가되지 않아야 합니다', async () => {
      mockPrismaService.favoriteIndicator.findUnique.mockResolvedValue({
        userId: mockUserId,
        indicatorId: mockIndicatorId,
      });

      const result = await service.addFavoriteIndicator(
        mockUserId,
        mockIndicatorId,
      );

      expect(mockPrismaService.favoriteIndicator.create).not.toHaveBeenCalled();
      expect(result).toEqual({ message: '이미 즐겨찾기에 추가되어 있습니다.' });
    });
  });

  describe('removeFavoriteIndicator', () => {
    it('경제지표 즐겨찾기를 성공적으로 제거해야 합니다', async () => {
      mockPrismaService.favoriteIndicator.delete.mockResolvedValue({
        userId: mockUserId,
        indicatorId: mockIndicatorId,
      });

      const result = await service.removeFavoriteIndicator(
        mockUserId,
        mockIndicatorId,
      );

      expect(mockPrismaService.favoriteIndicator.delete).toHaveBeenCalledWith({
        where: {
          userId_indicatorId: {
            userId: mockUserId,
            indicatorId: mockIndicatorId,
          },
        },
      });

      expect(result).toEqual({
        message: '즐겨찾기에서 성공적으로 제거되었습니다.',
      });
    });
  });
});
