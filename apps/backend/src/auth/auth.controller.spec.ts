import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { frontendConfig } from '../config/frontend.config';
import { RegisterDto, UserDto } from './dto/users.dto';
import { VerifyDto, LoginDto, OAuthConnectionDto } from './dto/auth.dto';
import { OAuthGuardFactory } from './oauth/oauth-strategy.factory';
import { OAuthProviderEnum } from './enum/oauth-provider.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UserService;

  const mockAuthService = {
    loginWithEmail: jest.fn(),
    loginWithOAuth: jest.fn(),
    generateVerificationToken: jest.fn(),
    generateOAuthStateToken: jest.fn(),
    verifyJwtToken: jest.fn(),
    setAuthCookies: jest.fn(),
    refreshTokens: jest.fn(),
    getFrontendUrl: jest.fn(() => mockFrontendConfig.baseUrl),
    handleOAuthLogin: jest.fn(),
  };

  const mockUsersService = {
    sendVerificationCode: jest.fn(),
    verifyEmailCode: jest.fn(),
    findEmailFromVerificationToken: jest.fn(),
    linkOAuthAccount: jest.fn(),
    findUserByOAuthId: jest.fn(),
    findUserByEmail: jest.fn(),
    createUserFromOAuth: jest.fn(),
    removeRefreshTokenHash: jest.fn(),
  };

  const mockFrontendConfig = {
    baseUrl: 'http://localhost:3000',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUsersService,
        },
        {
          provide: frontendConfig.KEY,
          useValue: mockFrontendConfig,
        },
        {
          provide: OAuthGuardFactory,
          useValue: {
            get: jest.fn().mockImplementation((provider: OAuthProviderEnum) => {
              // 예시로, canActivate 메서드가 항상 true를 반환하는 간단한 가드를 리턴할 수 있습니다.
              return {
                canActivate: jest.fn(() => true),
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and send verification code', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
      };

      const token = 'verification-token';
      const message = '인증 코드가 이메일로 전송되었습니다.';

      mockUsersService.sendVerificationCode.mockResolvedValue(undefined);
      mockAuthService.generateVerificationToken.mockResolvedValue(token);

      const result = await controller.register(registerDto);

      expect(usersService.sendVerificationCode).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(authService.generateVerificationToken).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(result).toEqual({ token, message });
    });
  });

  describe('verifyEmailCode', () => {
    it('should verify email code and return user', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      const user: UserDto = {
        id: 1,
        email: 'test@example.com',
        nickname: 'tester',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.verifyEmailCode.mockResolvedValue(user);

      const result = await controller.verifyEmailCode(verifyDto);

      expect(usersService.verifyEmailCode).toHaveBeenCalledWith(
        verifyDto.email,
        verifyDto.code,
      );
      expect(result).toEqual(user);
    });
  });

  describe('getVerifyEmail', () => {
    it('should return email from verification token', async () => {
      const token = 'verification-token';
      const email = 'test@example.com';

      mockUsersService.findEmailFromVerificationToken.mockResolvedValue(email);

      const result = await controller.getVerifyEmail(token);

      expect(usersService.findEmailFromVerificationToken).toHaveBeenCalledWith(
        token,
      );
      expect(result).toEqual({ email });
    });
  });

  describe('login', () => {
    it('should set cookies and return user info', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const loginResult = {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
        user: { id: 1, email: 'test@example.com', nickname: 'tester' },
      };
      mockAuthService.loginWithEmail.mockResolvedValue(loginResult);
      mockAuthService.setAuthCookies = jest.fn();

      const res = { json: jest.fn() };
      await controller.login(loginDto, res as any);

      expect(mockAuthService.setAuthCookies).toHaveBeenCalledWith(
        res,
        loginResult.accessToken,
        loginResult.refreshToken,
      );
      expect(res.json).toHaveBeenCalledWith({ user: loginResult.user });
    });
  });

  describe('getStatus', () => {
    it('should return authenticated status and user', () => {
      const req = Object.assign(
        {
          user: {
            id: 1,
            email: 'test@example.com',
            nickname: 'tester',
            verified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {},
      );

      const result = controller.getStatus(req as any);

      expect(result).toEqual({
        isAuthenticated: true,
        user: req.user,
      });
    });
  });

  describe('connectOAuthAccount', () => {
    it('should generate oauth state token and return redirect url', () => {
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
      };

      const oauthConnectionDto: OAuthConnectionDto = {
        provider: 'google',
      };

      const stateToken = 'state-token';

      mockAuthService.generateOAuthStateToken.mockReturnValue(stateToken);

      const result = controller.connectOAuthAccount(
        req as any,
        oauthConnectionDto,
      );

      expect(authService.generateOAuthStateToken).toHaveBeenCalledWith(
        req.user.id,
        oauthConnectionDto.provider,
      );

      expect(result).toEqual({
        redirectUrl: `${mockFrontendConfig.baseUrl}/api/v1/auth/oauth/${oauthConnectionDto.provider}?state=state-token`,
      });
    });
  });

  describe('oauthCallback', () => {
    it('should handle oauth login when user already exists', async () => {
      const provider = 'google';
      const query = {};
      const req = {
        user: {
          provider: 'google',
          providerId: '123456',
          email: 'test@example.com',
        },
        query: {},
      };
      const res = {
        redirect: jest.fn(),
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        verified: true,
      };

      const loginResult = {
        accessToken: 'oauth-jwt-token',
        user: existingUser,
      };

      mockAuthService.handleOAuthLogin.mockResolvedValue({
        user: existingUser,
      });
      mockAuthService.loginWithOAuth.mockResolvedValue(loginResult);

      await controller.oauthCallback(provider, query, req, res);

      expect(authService.handleOAuthLogin).toHaveBeenCalledWith(
        req.user,
        undefined,
      );
      expect(authService.loginWithOAuth).toHaveBeenCalledWith(existingUser);
      expect(res.redirect).toHaveBeenCalledWith(
        `${mockFrontendConfig.baseUrl}/auth/success`,
      );
    });

    it('should handle oauth account connection with valid state token', async () => {
      const provider = 'google';
      const stateToken = 'valid-state-token';
      const req = {
        user: {
          provider: 'google',
          providerId: '123456',
          email: 'test@example.com',
        },
        query: {
          state: stateToken,
        },
      };
      const res = {
        redirect: jest.fn(),
      };

      const statePayload = {
        userId: 1,
        provider: 'google',
      };

      const loginResult = {
        accessToken: 'oauth-jwt-token',
        user: { id: 1, email: 'test@example.com', verified: true },
      };

      mockAuthService.handleOAuthLogin.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', verified: true },
        redirectPath: '/mypage?message=계정이 성공적으로 연결되었습니다.',
      });
      mockAuthService.loginWithOAuth.mockResolvedValue(loginResult);

      await controller.oauthCallback(provider, {}, req, res);

      expect(authService.handleOAuthLogin).toHaveBeenCalledWith(
        req.user,
        stateToken,
      );
      expect(authService.loginWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
      );
      expect(res.redirect).toHaveBeenCalledWith(
        `${mockFrontendConfig.baseUrl}/mypage?message=계정이 성공적으로 연결되었습니다.`,
      );
    });

    it('should create a new user when no existing account is found', async () => {
      const provider = 'google';
      const query = {};
      const req = {
        user: {
          provider: 'google',
          providerId: '123456',
          email: 'new@example.com',
        },
        query: {},
      };
      const res = {
        redirect: jest.fn(),
      };

      const newUser = {
        id: 2,
        email: 'new@example.com',
        verified: true,
      };

      const loginResult = {
        accessToken: 'new-oauth-jwt-token',
        user: newUser,
      };

      mockAuthService.handleOAuthLogin.mockResolvedValue({ user: newUser });
      mockAuthService.loginWithOAuth.mockResolvedValue(loginResult);

      await controller.oauthCallback(provider, query, req, res);

      expect(authService.handleOAuthLogin).toHaveBeenCalledWith(
        req.user,
        undefined,
      );
      expect(authService.loginWithOAuth).toHaveBeenCalledWith(newUser);
      expect(res.redirect).toHaveBeenCalledWith(
        `${mockFrontendConfig.baseUrl}/auth/success`,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should set cookies and return message', async () => {
      const req = { signedCookies: { Refresh: 'refresh-token' } };
      const res = { json: jest.fn() };
      const tokens = { accessToken: 'new-access', refreshToken: 'new-refresh' };
      mockAuthService.refreshTokens = jest.fn().mockResolvedValue(tokens);
      mockAuthService.setAuthCookies = jest.fn();

      await controller.refreshTokens(req as any, res as any);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        'refresh-token',
      );
      expect(mockAuthService.setAuthCookies).toHaveBeenCalledWith(
        res,
        tokens.accessToken,
        tokens.refreshToken,
      );
      expect(res.json).toHaveBeenCalledWith({
        message: '토큰이 갱신되었습니다.',
      });
    });
  });

  describe('logout', () => {
    it('should clear cookies and return message', async () => {
      const req = { user: { id: 1 } };
      const res = {
        clearCookie: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockUsersService.removeRefreshTokenHash = jest
        .fn()
        .mockResolvedValue(undefined);

      await controller.logout(req as any, res as any);

      expect(res.clearCookie).toHaveBeenCalledWith(
        'Authentication',
        expect.any(Object),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        'Refresh',
        expect.any(Object),
      );
      expect(res.json).toHaveBeenCalledWith({ message: '로그아웃되었습니다.' });
    });
  });
});
