import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { jwtConfig } from '../config/jwt.config';
import {
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { OAuthProviderEnum } from '../security/enum/oauth-provider.enum';
import { EmailService } from '../email/email.service';
import { frontendConfig } from '../config/frontend.config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcryptjs');

// JwtService mock 생성
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest
    .fn()
    .mockReturnValue({ sub: 1, email: 'test@example.com', type: 'access' }),
};

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    findUserByOAuthId: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockPrismaService = {
    verificationToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    verificationCode: {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      update: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    oAuthAccount: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'test-secret-key',
    refreshSecret: 'test-refresh-secret',
    passwordResetSecret: 'test-password-reset-secret',
    expiration: '1d',
  };

  const mockFrontendConfig = {
    baseUrl: 'http://localhost:3000',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUsersService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
        {
          provide: frontendConfig.KEY,
          useValue: mockFrontendConfig,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: { sendPasswordResetEmail: jest.fn() },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('비밀번호가 유효하면 true를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed-password',
      );
      expect(result).toBe(true);
    });

    it('사용자를 찾을 수 없으면 false를 반환해야 합니다', async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBe(false);
    });

    it('사용자에게 비밀번호가 없으면 false를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: null,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toBe(false);
    });

    it('비밀번호가 유효하지 않으면 false를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrong-password',
      );

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong-password',
        'hashed-password',
      );
      expect(result).toBe(false);
    });
  });

  describe('loginWithEmail', () => {
    it('로그인이 성공하면 액세스 토큰과 사용자 정보를 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        nickname: 'tester',
      };

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'validateUser').mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.loginWithEmail(loginDto);

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { id: 1, email: 'test@example.com', nickname: 'tester' },
      });
    });

    it('사용자를 찾을 수 없으면 ForbiddenException을 발생시켜야 합니다', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('사용자에게 비밀번호가 없으면 ForbiddenException을 발생시켜야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: null,
        nickname: 'tester',
      };

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('비밀번호가 유효하지 않으면 UnauthorizedException을 발생시켜야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        nickname: 'tester',
      };

      const loginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'validateUser').mockResolvedValue(false);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('loginWithOAuth', () => {
    it('액세스 토큰과 리프레시 토큰을 반환해야 합니다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        nickname: 'tester',
      };
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.loginWithOAuth(mockUser as any);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
    });
  });

  describe('generateVerificationToken', () => {
    it('인증 토큰을 생성하고 저장해야 합니다', async () => {
      const email = 'test@example.com';

      mockPrismaService.verificationToken.create.mockResolvedValue({
        token: 'mock-token',
        email,
      });

      const token = await service.generateVerificationToken(email);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(mockPrismaService.verificationToken.create).toHaveBeenCalled();
    });
  });

  describe('generateOAuthStateToken', () => {
    it('OAuth 상태 토큰을 생성해야 합니다', () => {
      const userId = 1;
      const provider = OAuthProviderEnum.Google.toString();
      mockJwtService.sign.mockReturnValueOnce('mock-state-token');
      const token = service.generateOAuthStateToken(userId, provider);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          oauthMethod: 'connect',
          sub: userId,
          provider,
          type: 'access',
        }),
        expect.objectContaining({ expiresIn: '5m' }),
      );
      expect(token).toBe('mock-state-token');
    });
    it('유효하지 않은 제공자에 대해 오류를 발생시켜야 합니다', () => {
      const userId = 1;
      const provider = 'invalid-provider';
      expect(() => service.generateOAuthStateToken(userId, provider)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyJwtToken', () => {
    it('JWT 토큰을 검증하고 페이로드를 반환해야 합니다', () => {
      const token = 'valid-token';
      const mockPayload = { sub: 1, email: 'test@example.com', type: 'access' };
      mockJwtService.verify.mockReturnValueOnce(mockPayload);
      const result = service.verifyJwtToken(token);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockPayload);
    });
  });

  describe('setAuthCookies', () => {
    it('올바른 옵션으로 인증 및 리프레시 쿠키를 설정해야 합니다', () => {
      const res = { cookie: jest.fn().mockReturnThis() };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      service.setAuthCookies(res as any, accessToken, refreshToken);
      expect(res.cookie).toHaveBeenCalledWith(
        'Authentication',
        accessToken,
        expect.objectContaining({
          httpOnly: true,
          signed: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'Refresh',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          signed: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        }),
      );
    });
  });
});
