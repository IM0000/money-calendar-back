import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuthProviderEnum } from './enum/oauth-provider.enum';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtConfiguration: ConfigType<typeof jwtConfig>;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    storeVerificationToken: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'test-secret-key',
    expiration: '1d',
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtConfiguration = module.get<ConfigType<typeof jwtConfig>>(jwtConfig.KEY);

    jest.clearAllMocks();
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
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
          nickname: mockUser.nickname,
        },
        mockJwtConfig.secret,
        { expiresIn: mockJwtConfig.expiration },
      );
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
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

      (jwt.sign as jest.Mock).mockReturnValue('mock-oauth-jwt-token');

      const result = await service.loginWithOAuth(mockUser as any);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
          nickname: mockUser.nickname,
        },
        mockJwtConfig.secret,
        { expiresIn: mockJwtConfig.expiration },
      );
      expect(result).toEqual({
        accessToken: 'mock-oauth-jwt-token',
        user: { id: 1, email: 'test@example.com', nickname: 'tester' },
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

      (jwt.sign as jest.Mock).mockReturnValue('mock-state-token');

      const token = service.generateOAuthStateToken(userId, provider);

      expect(jwt.sign).toHaveBeenCalledWith(
        { oauthMethod: 'connect', userId, provider },
        mockJwtConfig.secret,
        { expiresIn: '5m' },
      );
      expect(token).toBe('mock-state-token');
    });

    it('should throw an error for invalid provider', async () => {
      const userId = 1;
      const provider = 'invalid-provider';

      expect(() => service.generateOAuthStateToken(userId, provider)).toThrow(
        '지원하지 않는 OAuth 제공자입니다',
      );
    });
  });

  describe('verifyJwtToken', () => {
    it('should verify JWT token and return payload', () => {
      const token = 'valid-token';
      const mockPayload = { sub: 1, email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = service.verifyJwtToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, mockJwtConfig.secret);
      expect(result).toEqual(mockPayload);
    });
  });
});
