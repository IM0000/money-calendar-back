import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    oAuthAccount: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByEmail', () => {
    it('사용자를 찾으면 사용자를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nickname: 'tester',
        password: 'hashed-password',
        oauthAccounts: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@example.com');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('사용자를 찾을 수 없으면 null을 반환해야 합니다', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('사용자를 찾으면 사용자를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nickname: 'tester',
        password: 'hashed-password',
        oauthAccounts: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('사용자를 찾을 수 없으면 null을 반환해야 합니다', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    it('사용자 프로필을 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nickname: 'tester',
        password: 'hashed-password',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        oauthAccounts: [
          {
            provider: 'google',
            providerId: '123456',
            oauthEmail: 'test@gmail.com',
          },
        ],
      };

      const expectedResult = {
        id: 1,
        email: 'test@example.com',
        hasPassword: true,
        nickname: 'tester',
        verified: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        oauthConnections: [
          { provider: 'google', connected: true, oauthEmail: 'test@gmail.com' },
          { provider: 'kakao', connected: false, oauthEmail: undefined },
          { provider: 'apple', connected: false, oauthEmail: undefined },
          { provider: 'discord', connected: false, oauthEmail: undefined },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserProfile(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          oauthAccounts: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('사용자를 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserProfile(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserProfile', () => {
    it('사용자 닉네임을 업데이트해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nickname: 'newNickname',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto = { nickname: 'newNickname' };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.updateUserProfile(1, updateDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        nickname: 'newNickname',
        verified: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });
  });

  describe('changeUserPassword', () => {
    it('사용자 비밀번호를 성공적으로 변경해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'old-hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: 'new-hashed-password',
      });

      const result = await service.changeUserPassword(
        1,
        'oldPassword',
        'newPassword',
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'oldPassword',
        'old-hashed-password',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'new-hashed-password' },
      });
      expect(result).toEqual({
        message: '비밀번호가 성공적으로 변경되었습니다.',
      });
    });

    it('현재 비밀번호가 틀리면 BadRequestException을 발생시켜야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'old-hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changeUserPassword(1, 'wrongPassword', 'newPassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyUserPassword', () => {
    it('비밀번호가 유효하면 true를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        password: 'hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyUserPassword(1, 'password123');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed-password',
      );
      expect(result).toBe(true);
    });

    it('비밀번호가 유효하지 않으면 false를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        password: 'hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyUserPassword(1, 'wrongPassword');

      expect(result).toBe(false);
    });

    it('사용자를 찾을 수 없으면 NotFoundException을 발생시켜야 합니다', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyUserPassword(999, 'password')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('disconnectOAuthAccount', () => {
    it('OAuth 계정을 성공적으로 연결 해제해야 합니다', async () => {
      mockPrismaService.oAuthAccount.findMany.mockResolvedValue([
        { provider: 'google', userId: 1 },
        { provider: 'kakao', userId: 1 },
      ]);
      mockPrismaService.oAuthAccount.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.disconnectOAuthAccount(1, 'google');

      expect(mockPrismaService.oAuthAccount.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(mockPrismaService.oAuthAccount.deleteMany).toHaveBeenCalledWith({
        where: { userId: 1, provider: 'google' },
      });
      expect(result).toEqual({ message: 'google 계정 연결이 해제되었습니다.' });
    });

    it('연결된 계정이 1개 이하일 때 연결 해제를 시도하면 ForbiddenException을 발생시켜야 합니다', async () => {
      mockPrismaService.oAuthAccount.findMany.mockResolvedValue([
        { provider: 'google', userId: 1 },
      ]);

      await expect(service.disconnectOAuthAccount(1, 'google')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
