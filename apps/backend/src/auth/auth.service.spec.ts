import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import {
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { OAuthProviderEnum } from './enum/oauth-provider.enum';
import { EmailService } from '../email/email.service';
import { frontendConfig } from '../config/frontend.config';

jest.mock('bcryptjs');
// jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtConfiguration: ConfigType<typeof jwtConfig>;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    storeVerificationToken: jest.fn(),
    setCurrentRefreshTokenHash: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'test-secret-key',
    expiration: '1d',
  };

  const mockFrontendConfig = {
    baseUrl: 'http://localhost:3000',
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ sub: 1, email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
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
          provide: 'JWT',
          useValue: mockJwtService,
        },
        {
          provide: 'PASSWORD_RESET_JWT',
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: 'REFRESH_JWT',
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtConfiguration = module.get<ConfigType<typeof jwtConfig>>(jwtConfig.KEY);

    jest.clearAllMocks();
    jest.spyOn(jwt, 'sign').mockReturnValue('mock-jwt-token');
    jest
      .spyOn(jwt, 'verify')
      .mockReturnValue({ sub: 1, email: 'test@example.com' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return true if password is valid', async () => {
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

    it('should return false if user not found', async () => {
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

    it('should return false if user has no password', async () => {
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

    it('should return false if password is invalid', async () => {
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
    it('should return access token and user info if login is successful', async () => {
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
      (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await service.loginWithEmail(loginDto);

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      const signCall = mockJwtService.sign.mock.calls[0];
      expect(signCall[0]).toMatchObject({
        sub: mockUser.id,
        email: mockUser.email,
        type: 'access',
      });
      if (signCall[1]) {
        expect(signCall[1]).toMatchObject({ secret: mockJwtConfig.secret });
      }
      if (signCall[2]) {
        expect(signCall[2]).toMatchObject({
          expiresIn: mockJwtConfig.expiration,
          secret: mockJwtConfig.secret,
        });
      }
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com', nickname: 'tester' },
      });
    });

    it('should throw ForbiddenException if user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if user has no password', async () => {
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

    it('should throw UnauthorizedException if password is invalid', async () => {
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
    it('should return access token and user info', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        nickname: 'tester',
      };

      mockJwtService.sign.mockReturnValue('mock-oauth-jwt-token');

      const result = await service.loginWithOAuth(mockUser as any);

      const signCall = mockJwtService.sign.mock.calls[0];
      expect(signCall[0]).toMatchObject({
        sub: mockUser.id,
        email: mockUser.email,
        type: 'access',
      });
      if (signCall[1]) {
        expect(signCall[1]).toMatchObject({ secret: mockJwtConfig.secret });
      }
      if (signCall[2]) {
        expect(signCall[2]).toMatchObject({
          expiresIn: mockJwtConfig.expiration,
          secret: mockJwtConfig.secret,
        });
      }
      expect(result).toEqual({
        accessToken: 'mock-oauth-jwt-token',
        refreshToken: 'mock-oauth-jwt-token',
      });
    });
  });

  describe('generateVerificationToken', () => {
    it('should generate a verification token and store it', async () => {
      const email = 'test@example.com';

      mockUsersService.storeVerificationToken.mockResolvedValue(undefined);

      const token = await service.generateVerificationToken(email);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(mockUsersService.storeVerificationToken).toHaveBeenCalledWith(
        token,
        email,
      );
    });
  });

  describe('generateOAuthStateToken', () => {
    it('should generate an OAuth state token', async () => {
      const userId = 1;
      const provider = OAuthProviderEnum.Google;

      mockJwtService.sign.mockReturnValue('mock-state-token');

      const token = service.generateOAuthStateToken(userId, provider);

      const signCall = mockJwtService.sign.mock.calls[0];
      expect(signCall[0]).toMatchObject({
        oauthMethod: 'connect',
        sub: userId,
        provider,
        type: 'access',
      });
      expect(signCall[1]).toMatchObject({
        expiresIn: '5m',
      });
      expect(token).toBe('mock-state-token');
    });

    it('should throw an error for invalid provider', () => {
      const userId = 1;
      const provider = 'invalid-provider';
      try {
        service.generateOAuthStateToken(userId, provider);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.response.errorMessage).toContain(
          '지원하지 않는 OAuth 인증기관입니다',
        );
      }
    });
  });

  describe('verifyJwtToken', () => {
    it('should verify JWT token and return payload', () => {
      const token = 'valid-token';
      const mockPayload = { sub: 1, email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = service.verifyJwtToken(token);

      const verifyCall = mockJwtService.verify.mock.calls[0];
      expect(verifyCall[0]).toBe(token);
      expect(result).toEqual(mockPayload);
    });
  });

  describe('setAuthCookies', () => {
    it('should set Authentication and Refresh cookies with correct options', () => {
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
