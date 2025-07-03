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

describe('AuthService', () => {
  let service: AuthService;

  // 테스트 데이터 팩토리 함수들
  const createMockUser = (overrides = {}) => ({
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
    nickname: 'tester',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createLoginDto = (overrides = {}) => ({
    email: 'test@example.com',
    password: 'password123',
    ...overrides,
  });

  const createJwtPayload = (overrides = {}) => ({
    sub: 1,
    email: 'test@example.com',
    type: 'access',
    ...overrides,
  });

  // JwtService mock 생성
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue(createJwtPayload()),
  };

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthService', () => {
    it('서비스 인스턴스가 정상적으로 생성되어야 한다', () => {
      expect(service).toBeDefined();
    });
  });

  describe('validateUser', () => {
    describe('비밀번호 검증 성공', () => {
      it('이메일과 비밀번호가 일치하면 true를 반환한다', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        const mockUser = createMockUser();

        mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // Act
        const result = await service.validateUser(email, password);

        // Assert
        expect(result).toBe(true);
        expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(email);
        expect(bcrypt.compare).toHaveBeenCalledWith(
          password,
          mockUser.password,
        );
      });
    });

    describe('비밀번호 검증 실패', () => {
      it('존재하지 않는 이메일로 요청하면 false를 반환한다', async () => {
        // Arrange
        const email = 'nonexistent@example.com';
        const password = 'password123';

        mockUsersService.findUserByEmail.mockResolvedValue(null);

        // Act
        const result = await service.validateUser(email, password);

        // Assert
        expect(result).toBe(false);
        expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(email);
      });

      it('OAuth만 사용하는 사용자(비밀번호 없음)로 로그인 시도하면 false를 반환한다', async () => {
        // Arrange
        const email = 'oauth@example.com';
        const password = 'password123';
        const mockUser = createMockUser({ password: null });

        mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

        // Act
        const result = await service.validateUser(email, password);

        // Assert
        expect(result).toBe(false);
      });

      it('잘못된 비밀번호로 로그인 시도하면 false를 반환한다', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'wrong-password';
        const mockUser = createMockUser();

        mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act
        const result = await service.validateUser(email, password);

        // Assert
        expect(result).toBe(false);
        expect(bcrypt.compare).toHaveBeenCalledWith(
          password,
          mockUser.password,
        );
      });
    });
  });

  describe('loginWithEmail', () => {
    describe('이메일 로그인 성공', () => {
      it('올바른 이메일과 비밀번호로 로그인하면 토큰과 사용자 정보를 반환한다', async () => {
        // Arrange
        const loginDto = createLoginDto();
        const mockUser = createMockUser();
        const expectedTokens = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        };

        mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
        jest.spyOn(service, 'validateUser').mockResolvedValue(true);
        mockJwtService.sign
          .mockReturnValueOnce(expectedTokens.accessToken)
          .mockReturnValueOnce(expectedTokens.refreshToken);
        mockPrismaService.user.update.mockResolvedValue(mockUser);

        // Act
        const result = await service.loginWithEmail(loginDto);

        // 비밀번호를 제거한 사용자 객체 생성
        const { password, ...userWithoutPassword } = mockUser;

        // Assert
        expect(result).toEqual({
          ...expectedTokens,
          user: userWithoutPassword,
        });
        expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
        expect(mockPrismaService.user.update).toHaveBeenCalled();
      });
    });

    describe('이메일 로그인 실패', () => {
      it('존재하지 않는 이메일로 로그인 시도하면 ForbiddenException을 발생시킨다', async () => {
        // Arrange
        const loginDto = createLoginDto({ email: 'nonexistent@example.com' });
        mockUsersService.findUserByEmail.mockResolvedValue(null);

        // Act & Assert
        await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
          ForbiddenException,
        );
      });

      it('OAuth 전용 계정으로 이메일 로그인 시도하면 ForbiddenException을 발생시킨다', async () => {
        // Arrange
        const loginDto = createLoginDto();
        const mockUser = createMockUser({ password: null });

        mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

        // Act & Assert
        await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
          ForbiddenException,
        );
      });

      it('잘못된 비밀번호로 로그인 시도하면 UnauthorizedException을 발생시킨다', async () => {
        // Arrange
        const loginDto = createLoginDto({ password: 'wrong-password' });
        const mockUser = createMockUser();

        mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
        jest.spyOn(service, 'validateUser').mockResolvedValue(false);

        // Act & Assert
        await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });
  });

  describe('loginWithOAuth', () => {
    it('OAuth 사용자 로그인시 액세스 토큰과 리프레시 토큰을 생성한다', async () => {
      // Arrange
      const mockUser = createMockUser();
      const expectedTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockJwtService.sign
        .mockReturnValueOnce(expectedTokens.accessToken)
        .mockReturnValueOnce(expectedTokens.refreshToken);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      // Act
      const result = await service.loginWithOAuth(mockUser as any);

      // Assert
      expect(result).toEqual(expectedTokens);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('generateVerificationToken', () => {
    it('이메일 인증을 위한 고유 토큰을 생성하고 저장한다', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockToken = {
        token: 'mock-verification-token',
        email,
      };

      mockPrismaService.verificationToken.create.mockResolvedValue(mockToken);

      // Act
      const token = await service.generateVerificationToken(email);

      // Assert
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(mockPrismaService.verificationToken.create).toHaveBeenCalled();
    });
  });

  describe('generateOAuthStateToken', () => {
    describe('OAuth 상태 토큰 생성', () => {
      it('유효한 OAuth 제공자로 상태 토큰을 생성한다', () => {
        // Arrange
        const userId = 1;
        const provider = OAuthProviderEnum.Google.toString();
        const expectedToken = 'mock-state-token';

        mockJwtService.sign.mockReturnValueOnce(expectedToken);

        // Act
        const token = service.generateOAuthStateToken(userId, provider);

        // Assert
        expect(token).toBe(expectedToken);
        expect(mockJwtService.sign).toHaveBeenCalledWith(
          expect.objectContaining({
            oauthMethod: 'connect',
            sub: userId,
            provider,
            type: 'access',
          }),
          expect.objectContaining({ expiresIn: '5m' }),
        );
      });

      it('지원하지 않는 OAuth 제공자로 요청하면 BadRequestException을 발생시킨다', () => {
        // Arrange
        const userId = 1;
        const provider = 'invalid-provider';

        // Act & Assert
        expect(() => service.generateOAuthStateToken(userId, provider)).toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('verifyJwtToken', () => {
    it('유효한 JWT 토큰을 검증하고 페이로드를 반환한다', () => {
      // Arrange
      const token = 'valid-token';
      const mockPayload = createJwtPayload();

      mockJwtService.verify.mockReturnValueOnce(mockPayload);

      // Act
      const result = service.verifyJwtToken(token);

      // Assert
      expect(result).toEqual(mockPayload);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
    });

    it('만료된 JWT 토큰을 검증하면 UnauthorizedException을 발생시킨다', () => {
      // Arrange
      const token = 'expired-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      // Act & Assert
      expect(() => service.verifyJwtToken(token)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('setAuthCookies', () => {
    it('인증 쿠키와 리프레시 쿠키를 올바른 옵션으로 설정한다', () => {
      // Arrange
      const res = { cookie: jest.fn().mockReturnThis() };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      // Act
      service.setAuthCookies(res as any, accessToken, refreshToken);

      // Assert
      expect(res.cookie).toHaveBeenCalledWith(
        'Authentication',
        accessToken,
        expect.objectContaining({
          httpOnly: true,
          signed: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60, // 1시간
        }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'Refresh',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          signed: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        }),
      );
    });
  });
});
