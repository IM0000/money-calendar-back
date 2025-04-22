import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { frontendConfig } from '../config/frontend.config';
import { RegisterDto, UserDto } from './dto/users.dto';
import { VerifyDto, LoginDto, OAuthConnectionDto } from './dto/auth.dto';
import { OAuthGuardFactory } from './strategies/oauth-strategy.factory';
import { OAuthProviderEnum } from './enum/oauth-provider.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    loginWithEmail: jest.fn(),
    loginWithOAuth: jest.fn(),
    generateVerificationToken: jest.fn(),
    generateOAuthStateToken: jest.fn(),
    verifyJwtToken: jest.fn(),
  };

  const mockUsersService = {
    sendVerificationCode: jest.fn(),
    verifyEmailCode: jest.fn(),
    findEmailFromVerificationToken: jest.fn(),
    linkOAuthAccount: jest.fn(),
    findUserByOAuthId: jest.fn(),
    findUserByEmail: jest.fn(),
    createUserFromOAuth: jest.fn(),
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
          provide: UsersService,
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
    usersService = module.get<UsersService>(UsersService);

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
        password: '',
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
    it('should login user with email and password', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginResult = {
        accessToken: 'jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          nickname: 'tester',
        },
      };

      mockAuthService.loginWithEmail.mockResolvedValue(loginResult);

      const result = await controller.login(loginDto);

      expect(authService.loginWithEmail).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResult);
    });
  });

  describe('getStatus', () => {
    it('should return authenticated status and user', () => {
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
      };

      const result = controller.getStatus(req);

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
        message: '계정 연결을 위해 OAuth 인증 페이지로 이동하세요.',
        redirectUrl: `/api/v1/auth/oauth/${
          oauthConnectionDto.provider
        }?state=${encodeURIComponent(stateToken)}`,
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

      mockUsersService.findUserByOAuthId.mockResolvedValue(existingUser);
      mockAuthService.loginWithOAuth.mockResolvedValue(loginResult);

      await controller.oauthCallback(provider, query, req, res);

      expect(usersService.findUserByOAuthId).toHaveBeenCalledWith(
        req.user.provider,
        req.user.providerId,
      );

      expect(authService.loginWithOAuth).toHaveBeenCalledWith(existingUser);

      expect(res.redirect).toHaveBeenCalledWith(
        `${mockFrontendConfig.baseUrl}/auth/success?token=${loginResult.accessToken}`,
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

      mockAuthService.verifyJwtToken.mockReturnValue(statePayload);
      mockUsersService.linkOAuthAccount.mockResolvedValue(undefined);

      await controller.oauthCallback(provider, {}, req, res);

      expect(authService.verifyJwtToken).toHaveBeenCalledWith(stateToken);
      expect(usersService.linkOAuthAccount).toHaveBeenCalledWith(
        statePayload.userId,
        req.user,
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

      mockUsersService.findUserByOAuthId.mockResolvedValue(null);
      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.createUserFromOAuth.mockResolvedValue(newUser);
      mockAuthService.loginWithOAuth.mockResolvedValue(loginResult);

      await controller.oauthCallback(provider, query, req, res);

      expect(usersService.findUserByOAuthId).toHaveBeenCalledWith(
        req.user.provider,
        req.user.providerId,
      );

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(req.user.email);
      expect(usersService.createUserFromOAuth).toHaveBeenCalledWith(req.user);
      expect(authService.loginWithOAuth).toHaveBeenCalledWith(newUser);

      expect(res.redirect).toHaveBeenCalledWith(
        `${mockFrontendConfig.baseUrl}/auth/success?token=${loginResult.accessToken}`,
      );
    });
  });
});
