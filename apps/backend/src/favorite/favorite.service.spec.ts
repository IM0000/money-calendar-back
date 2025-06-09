import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let prismaService: PrismaService;

  // PrismaService 목킹 (회사/지표 그룹 단위만)
  const mockPrismaService = {
    favoriteCompany: {
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    favoriteIndicatorGroup: {
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockUserId = 1;
  const mockCompanyId = 10;
  const mockBaseName = 'CPI';
  const mockCountry = 'USA';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('FavoriteService가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('addFavoriteCompany', () => {
    it('회사 즐겨찾기 추가 성공 (upsert 사용)', async () => {
      mockPrismaService.favoriteCompany.upsert.mockResolvedValue({ id: 1 });
      const result = await service.addFavoriteCompany(
        mockUserId,
        mockCompanyId,
      );
      expect(mockPrismaService.favoriteCompany.upsert).toHaveBeenCalledWith({
        where: {
          userId_companyId: { userId: mockUserId, companyId: mockCompanyId },
        },
        update: { isActive: true },
        create: {
          userId: mockUserId,
          companyId: mockCompanyId,
          isActive: true,
        },
      });
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('removeFavoriteCompany', () => {
    it('회사 즐겨찾기 해제 성공', async () => {
      mockPrismaService.favoriteCompany.findUnique.mockResolvedValue({
        id: 1,
        isActive: true,
      });
      mockPrismaService.favoriteCompany.update.mockResolvedValue({ id: 1 });
      const result = await service.removeFavoriteCompany(
        mockUserId,
        mockCompanyId,
      );
      expect(mockPrismaService.favoriteCompany.findUnique).toHaveBeenCalledWith(
        {
          where: {
            userId_companyId: { userId: mockUserId, companyId: mockCompanyId },
          },
        },
      );
      expect(mockPrismaService.favoriteCompany.update).toHaveBeenCalledWith({
        where: {
          userId_companyId: { userId: mockUserId, companyId: mockCompanyId },
        },
        data: { isActive: false },
      });
      expect(result).toEqual({ id: 1 });
    });

    it('존재하지 않는 회사 즐겨찾기 해제 시 NotFoundException 발생', async () => {
      mockPrismaService.favoriteCompany.findUnique.mockResolvedValue(null);
      await expect(
        service.removeFavoriteCompany(mockUserId, mockCompanyId),
      ).rejects.toThrow(NotFoundException);
    });

    it('이미 비활성화된 회사 즐겨찾기 해제 시 NotFoundException 발생', async () => {
      mockPrismaService.favoriteCompany.findUnique.mockResolvedValue({
        id: 1,
        isActive: false,
      });
      await expect(
        service.removeFavoriteCompany(mockUserId, mockCompanyId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFavoriteCompanies', () => {
    it('내 회사 즐겨찾기 목록 조회', async () => {
      const mockFavoriteCompanies = [
        {
          id: 1,
          userId: mockUserId,
          companyId: mockCompanyId,
          isActive: true,
          favoritedAt: new Date(),
          company: {
            id: mockCompanyId,
            ticker: 'AAPL',
            name: 'Apple Inc.',
            country: 'USA',
            marketValue: '2000000000000',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      mockPrismaService.favoriteCompany.findMany.mockResolvedValue(
        mockFavoriteCompanies,
      );
      const result = await service.getFavoriteCompanies(mockUserId);
      expect(mockPrismaService.favoriteCompany.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        include: { company: true },
      });
      expect(result).toEqual(mockFavoriteCompanies);
    });
  });

  describe('addFavoriteIndicatorGroup', () => {
    it('지표 그룹 즐겨찾기 추가 성공 (upsert 사용)', async () => {
      mockPrismaService.favoriteIndicatorGroup.upsert.mockResolvedValue({
        id: 2,
      });
      const result = await service.addFavoriteIndicatorGroup(
        mockUserId,
        mockBaseName,
        mockCountry,
      );
      expect(
        mockPrismaService.favoriteIndicatorGroup.upsert,
      ).toHaveBeenCalledWith({
        where: {
          userId_baseName_country: {
            userId: mockUserId,
            baseName: mockBaseName,
            country: mockCountry,
          },
        },
        update: { isActive: true },
        create: {
          userId: mockUserId,
          baseName: mockBaseName,
          country: mockCountry,
          isActive: true,
        },
      });
      expect(result).toEqual({ id: 2 });
    });
  });

  describe('removeFavoriteIndicatorGroup', () => {
    it('지표 그룹 즐겨찾기 해제 성공', async () => {
      mockPrismaService.favoriteIndicatorGroup.findUnique.mockResolvedValue({
        id: 2,
        isActive: true,
      });
      mockPrismaService.favoriteIndicatorGroup.update.mockResolvedValue({
        id: 2,
      });
      const result = await service.removeFavoriteIndicatorGroup(
        mockUserId,
        mockBaseName,
        mockCountry,
      );
      expect(
        mockPrismaService.favoriteIndicatorGroup.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          userId_baseName_country: {
            userId: mockUserId,
            baseName: mockBaseName,
            country: mockCountry,
          },
        },
      });
      expect(
        mockPrismaService.favoriteIndicatorGroup.update,
      ).toHaveBeenCalledWith({
        where: {
          userId_baseName_country: {
            userId: mockUserId,
            baseName: mockBaseName,
            country: mockCountry,
          },
        },
        data: { isActive: false },
      });
      expect(result).toEqual({ id: 2 });
    });

    it('존재하지 않는 지표 그룹 즐겨찾기 해제 시 NotFoundException 발생', async () => {
      mockPrismaService.favoriteIndicatorGroup.findUnique.mockResolvedValue(
        null,
      );
      await expect(
        service.removeFavoriteIndicatorGroup(
          mockUserId,
          mockBaseName,
          mockCountry,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('이미 비활성화된 지표 그룹 즐겨찾기 해제 시 NotFoundException 발생', async () => {
      mockPrismaService.favoriteIndicatorGroup.findUnique.mockResolvedValue({
        id: 2,
        isActive: false,
      });
      await expect(
        service.removeFavoriteIndicatorGroup(
          mockUserId,
          mockBaseName,
          mockCountry,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFavoriteIndicatorGroups', () => {
    it('내 지표 그룹 즐겨찾기 목록 조회', async () => {
      mockPrismaService.favoriteIndicatorGroup.findMany.mockResolvedValue([
        { baseName: 'CPI', country: 'USA' },
      ]);
      const result = await service.getFavoriteIndicatorGroups(mockUserId);
      expect(
        mockPrismaService.favoriteIndicatorGroup.findMany,
      ).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        select: { baseName: true, country: true },
      });
      expect(result).toEqual([{ baseName: 'CPI', country: 'USA' }]);
    });
  });

  describe('getAllFavorites', () => {
    it('회사/지표 그룹 즐겨찾기 통합 조회', async () => {
      const mockCompanies = [
        {
          id: 1,
          userId: mockUserId,
          companyId: mockCompanyId,
          isActive: true,
          favoritedAt: new Date(),
          company: {
            id: mockCompanyId,
            ticker: 'AAPL',
            name: 'Apple Inc.',
            country: 'USA',
            marketValue: '2000000000000',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];
      const mockIndicatorGroups = [{ baseName: 'CPI', country: 'USA' }];

      jest
        .spyOn(service, 'getFavoriteCompanies')
        .mockResolvedValue(mockCompanies);
      jest
        .spyOn(service, 'getFavoriteIndicatorGroups')
        .mockResolvedValue(mockIndicatorGroups);

      const result = await service.getAllFavorites(mockUserId);

      expect(result).toEqual({
        companies: mockCompanies,
        indicatorGroups: mockIndicatorGroups,
      });
    });
  });
});
