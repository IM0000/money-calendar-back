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

  // 테스트 데이터 팩토리 함수들
  const createMockUser = (overrides = {}) => ({
    id: 1,
    email: 'test@example.com',
    nickname: 'tester',
    password: 'hashed-password',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    oauthAccounts: [],
    ...overrides,
  });

  const createMockOAuthAccount = (overrides = {}) => ({
    provider: 'google',
    providerId: '123456',
    oauthEmail: 'test@gmail.com',
    userId: 1,
    ...overrides,
  });

  const createUpdateProfileDto = (overrides = {}) => ({
    nickname: 'newNickname',
    ...overrides,
  });

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UserService', () => {
    it('서비스 인스턴스가 정상적으로 생성되어야 한다', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findUserByEmail', () => {
    describe('사용자 조회 성공', () => {
      it('이메일로 사용자를 찾으면 사용자 정보를 반환한다', async () => {
        // Arrange
        const email = 'test@example.com';
        const mockUser = createMockUser();

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        // Act
        const result = await service.findUserByEmail(email);

        // Assert
        expect(result).toEqual(mockUser);
        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
          where: { email },
        });
      });
    });

    describe('사용자 조회 실패', () => {
      it('존재하지 않는 이메일로 조회하면 null을 반환한다', async () => {
        // Arrange
        const email = 'nonexistent@example.com';
        mockPrismaService.user.findUnique.mockResolvedValue(null);

        // Act
        const result = await service.findUserByEmail(email);

        // Assert
        expect(result).toBeNull();
      });
    });
  });

  describe('findUserById', () => {
    describe('사용자 조회 성공', () => {
      it('ID로 사용자를 찾으면 사용자 정보를 반환한다', async () => {
        // Arrange
        const userId = 1;
        const mockUser = createMockUser();

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        // Act
        const result = await service.findUserById(userId);

        // Assert
        expect(result).toEqual(mockUser);
        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
        });
      });
    });

    describe('사용자 조회 실패', () => {
      it('존재하지 않는 ID로 조회하면 null을 반환한다', async () => {
        // Arrange
        const userId = 999;
        mockPrismaService.user.findUnique.mockResolvedValue(null);

        // Act
        const result = await service.findUserById(userId);

        // Assert
        expect(result).toBeNull();
      });
    });
  });

  describe('getUserProfile', () => {
    describe('프로필 조회 성공', () => {
      it('사용자 프로필과 연결된 OAuth 계정 정보를 함께 반환한다', async () => {
        // Arrange
        const userId = 1;
        const mockOAuthAccount = createMockOAuthAccount();
        const mockUser = createMockUser({
          oauthAccounts: [mockOAuthAccount],
        });

        const expectedResult = {
          id: mockUser.id,
          email: mockUser.email,
          hasPassword: true,
          nickname: mockUser.nickname,
          verified: mockUser.verified,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
          oauthConnections: [
            {
              provider: 'google',
              connected: true,
              oauthEmail: mockOAuthAccount.oauthEmail,
            },
            { provider: 'kakao', connected: false, oauthEmail: undefined },
            { provider: 'apple', connected: false, oauthEmail: undefined },
            { provider: 'discord', connected: false, oauthEmail: undefined },
          ],
        };

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        // Act
        const result = await service.getUserProfile(userId);

        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
          include: { oauthAccounts: true },
        });
      });

      it('비밀번호가 없는 OAuth 전용 사용자의 프로필을 조회한다', async () => {
        // Arrange
        const userId = 1;
        const mockUser = createMockUser({
          password: null,
          oauthAccounts: [createMockOAuthAccount()],
        });

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        // Act
        const result = await service.getUserProfile(userId);

        // Assert
        expect(result.hasPassword).toBe(false);
      });
    });

    describe('프로필 조회 실패', () => {
      it('존재하지 않는 사용자 ID로 조회하면 NotFoundException을 발생시킨다', async () => {
        // Arrange
        const userId = 999;
        mockPrismaService.user.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.getUserProfile(userId)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('updateUserProfile', () => {
    it('사용자 닉네임을 성공적으로 변경한다', async () => {
      // Arrange
      const userId = 1;
      const updateDto = createUpdateProfileDto();
      const mockUpdatedUser = createMockUser({
        nickname: updateDto.nickname,
      });

      mockPrismaService.user.findUnique.mockResolvedValue(createMockUser());
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await service.updateUserProfile(userId, updateDto);

      // Assert
      expect(result).toEqual({
        id: mockUpdatedUser.id,
        email: mockUpdatedUser.email,
        nickname: mockUpdatedUser.nickname,
        verified: mockUpdatedUser.verified,
        createdAt: mockUpdatedUser.createdAt,
        updatedAt: mockUpdatedUser.updatedAt,
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateDto,
      });
    });
  });

  describe('changeUserPassword', () => {
    describe('비밀번호 변경 성공', () => {
      it('현재 비밀번호가 일치하면 새 비밀번호로 변경한다', async () => {
        // Arrange
        const userId = 1;
        const currentPassword = 'oldPassword';
        const newPassword = 'newPassword';
        const mockUser = createMockUser();

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
        mockPrismaService.user.update.mockResolvedValue({
          ...mockUser,
          password: 'new-hashed-password',
        });

        // Act
        const result = await service.changeUserPassword(
          userId,
          currentPassword,
          newPassword,
        );

        // Assert
        expect(result).toEqual({
          message: '비밀번호가 성공적으로 변경되었습니다.',
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          currentPassword,
          mockUser.password,
        );
        expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      });
    });

    describe('비밀번호 변경 실패', () => {
      it('현재 비밀번호가 일치하지 않으면 BadRequestException을 발생시킨다', async () => {
        // Arrange
        const userId = 1;
        const wrongPassword = 'wrongPassword';
        const newPassword = 'newPassword';
        const mockUser = createMockUser();

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(
          service.changeUserPassword(userId, wrongPassword, newPassword),
        ).rejects.toThrow(BadRequestException);
      });

      it('사용자가 존재하지 않으면 NotFoundException을 발생시킨다', async () => {
        // Arrange
        const userId = 999;
        mockPrismaService.user.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(
          service.changeUserPassword(userId, 'password', 'newPassword'),
        ).rejects.toThrow(NotFoundException);
      });

      it('OAuth 전용 계정(비밀번호 없음)은 비밀번호를 변경할 수 없다', async () => {
        // Arrange
        const userId = 1;
        const mockUser = createMockUser({ password: null });

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        // Act & Assert
        await expect(
          service.changeUserPassword(userId, 'password', 'newPassword'),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('verifyUserPassword', () => {
    describe('비밀번호 검증 성공', () => {
      it('입력한 비밀번호가 저장된 비밀번호와 일치하면 true를 반환한다', async () => {
        // Arrange
        const userId = 1;
        const password = 'password123';
        const mockUser = createMockUser();

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // Act
        const result = await service.verifyUserPassword(userId, password);

        // Assert
        expect(result).toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith(
          password,
          mockUser.password,
        );
      });
    });

    describe('비밀번호 검증 실패', () => {
      it('입력한 비밀번호가 일치하지 않으면 false를 반환한다', async () => {
        // Arrange
        const userId = 1;
        const wrongPassword = 'wrongPassword';
        const mockUser = createMockUser();

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act
        const result = await service.verifyUserPassword(userId, wrongPassword);

        // Assert
        expect(result).toBe(false);
      });

      it('사용자가 존재하지 않으면 NotFoundException을 발생시킨다', async () => {
        // Arrange
        const userId = 999;
        mockPrismaService.user.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(
          service.verifyUserPassword(userId, 'password'),
        ).rejects.toThrow(NotFoundException);
      });

      it('OAuth 전용 계정은 비밀번호가 없어서 false를 반환한다', async () => {
        // Arrange
        const userId = 1;
        const mockUser = createMockUser({ password: null });

        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        // Act
        const result = await service.verifyUserPassword(userId, 'password');

        // Assert
        expect(result).toBe(false);
      });
    });
  });

  describe('disconnectOAuthAccount', () => {
    describe('OAuth 연결 해제 성공', () => {
      it('여러 OAuth 계정이 연결된 경우 하나를 해제할 수 있다', async () => {
        // Arrange
        const userId = 1;
        const provider = 'google';
        const mockOAuthAccounts = [
          createMockOAuthAccount({ provider: 'google' }),
          createMockOAuthAccount({ provider: 'kakao' }),
        ];

        mockPrismaService.oAuthAccount.findMany.mockResolvedValue(
          mockOAuthAccounts,
        );
        mockPrismaService.oAuthAccount.deleteMany.mockResolvedValue({
          count: 1,
        });

        // Act
        const result = await service.disconnectOAuthAccount(userId, provider);

        // Assert
        expect(result).toEqual({
          message: 'google 계정 연결이 해제되었습니다.',
        });
        expect(mockPrismaService.oAuthAccount.deleteMany).toHaveBeenCalledWith({
          where: { userId, provider },
        });
      });
    });

    describe('OAuth 연결 해제 실패', () => {
      it('마지막 남은 OAuth 계정은 해제할 수 없다', async () => {
        // Arrange
        const userId = 1;
        const provider = 'google';
        const mockOAuthAccounts = [
          createMockOAuthAccount({ provider: 'google' }),
        ];

        mockPrismaService.oAuthAccount.findMany.mockResolvedValue(
          mockOAuthAccounts,
        );

        // Act & Assert
        await expect(
          service.disconnectOAuthAccount(userId, provider),
        ).rejects.toThrow(ForbiddenException);
      });

      it('연결되지 않은 OAuth 제공자를 해제하려고 해도 정상적으로 처리한다', async () => {
        // Arrange
        const userId = 1;
        const provider = 'apple';
        const mockOAuthAccounts = [
          createMockOAuthAccount({ provider: 'google' }),
          createMockOAuthAccount({ provider: 'kakao' }),
        ];

        mockPrismaService.oAuthAccount.findMany.mockResolvedValue(
          mockOAuthAccounts,
        );
        mockPrismaService.oAuthAccount.deleteMany.mockResolvedValue({
          count: 0,
        });

        // Act
        const result = await service.disconnectOAuthAccount(userId, provider);

        // Assert
        expect(result).toEqual({
          message: 'apple 계정 연결이 해제되었습니다.',
        });
      });
    });
  });
});
