import { EmailService } from './../email/email.service';
import {
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { OAuthProviderEnum } from './enum/oauth-provider.enum';
import { JwtService } from '@nestjs/jwt';
import { frontendConfig } from '../config/frontend.config';
import { Response } from 'express';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(frontendConfig.KEY)
    private readonly frontendConfiguration: ConfigType<typeof frontendConfig>,
    @Inject(jwtConfig.KEY)
    private readonly jwtCfg: ConfigType<typeof jwtConfig>,
    private readonly jwt: JwtService,
    private readonly usersService: UserService,
    private readonly emailService: EmailService,
  ) {}

  getFrontendUrl(): string {
    return this.frontendConfiguration.baseUrl;
  }

  /**
   * 이메일과 비밀번호 검증
   * @param email 사용자 이메일
   * @param password 입력된 비밀번호
   * @returns 검증 결과 (true: 성공, false: 실패)
   */
  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user || !user.password) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }

  /**
   * 이메일과 비밀번호로 로그인 처리
   * @param loginDto 로그인 정보
   * @returns JWT 토큰과 사용자 정보
   */
  async loginWithEmail(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  }> {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    if (!user.password) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE_MAP.ACCOUNT_001,
        errorMessage: ERROR_MESSAGE_MAP.ACCOUNT_001,
        data: user,
      });
    }
    const isValid = await this.validateUser(loginDto.email, loginDto.password);
    if (!isValid) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_006,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_006,
      });
    }

    const { accessToken, refreshToken } = this.generateJwtToken(user);

    await this.usersService.setCurrentRefreshTokenHash(user.id, refreshToken);

    const { password, ...userWithoutPassword } = user;

    return { accessToken, refreshToken, user: userWithoutPassword };
  }

  /**
   * JWT 토큰 생성
   * @param user 사용자 정보
   * @returns JWT 토큰
   */
  private generateJwtToken(user: User) {
    const accessPayload = {
      type: 'access',
      sub: user.id,
      email: user.email,
    };

    const refreshPayload = {
      type: 'refresh',
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwt.sign(accessPayload);
    const refreshToken = this.jwt.sign(refreshPayload, {
      secret: this.jwtCfg.refreshSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * 이메일 인증 토큰 생성 및 저장
   * @param email 사용자 이메일
   * @returns opaque 토큰
   */
  async generateVerificationToken(email: string): Promise<string> {
    const token = uuidv4(); // 고유한 토큰 생성

    // 토큰을 데이터베이스에 저장
    await this.usersService.storeVerificationToken(token, email);
    return token;
  }

  /**
   * oauth 연동 state 토큰 생성
   * @param email 사용자 이메일
   * @returns oauth 연동 state 토큰
   */
  generateOAuthStateToken(userId: number, provider: string): string {
    // 유효한 OAuth 제공자인지 확인
    const validProviders = [
      OAuthProviderEnum.Google.toString(),
      OAuthProviderEnum.Apple.toString(),
      OAuthProviderEnum.Discord.toString(),
      OAuthProviderEnum.Kakao.toString(),
    ];

    if (!validProviders.includes(provider)) {
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.OAUTH_002,
        errorMessage: ERROR_MESSAGE_MAP.OAUTH_002,
      });
    }

    const statePayload = {
      type: 'access',
      oauthMethod: 'connect',
      sub: userId,
      provider,
    };

    const stateToken = this.jwt.sign(statePayload, {
      expiresIn: '5m',
    });

    return stateToken;
  }

  verifyJwtToken(token: string): any {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_002,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_002,
      });
    }
  }

  /**
   * 비밀번호 재설정 토큰 생성
   * @param email 사용자 이메일
   * @returns JWT 토큰
   */
  generatePasswordResetToken(email: string): string {
    const payload = {
      type: 'passwordReset',
      email,
    };

    return this.jwt.sign(payload, {
      secret: this.jwtCfg.passwordResetSecret,
      expiresIn: '1h',
    });
  }

  /**
   * 비밀번호 재설정 토큰 검증
   * @param token JWT 토큰
   * @returns 페이로드에서 추출한 이메일
   */
  verifyPasswordResetToken(token: string): { type: string; email: string } {
    try {
      const payload = this.jwt.verify(token) as {
        type: string;
        email: string;
      };

      if (payload.type !== 'passwordReset') {
        throw new UnauthorizedException({
          errorCode: ERROR_CODE_MAP.AUTH_002,
          errorMessage: ERROR_MESSAGE_MAP.AUTH_002,
        });
      }

      return payload;
    } catch {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_002,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_002,
      });
    }
  }

  /**
   * 비밀번호 재설정 이메일 발송
   * @param email 사용자 이메일
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    const token = this.generatePasswordResetToken(email);
    await this.emailService.sendPasswordResetEmail(email, token);
  }

  async handleOAuthLogin(
    oauthUser: any,
    state?: string,
  ): Promise<{ user: User; redirectPath?: string }> {
    if (state && typeof state === 'string') {
      const { sub: userId } = this.jwt.verify(state);
      await this.usersService.linkOAuthAccount(userId, oauthUser);
      const user = await this.usersService.findUserById(userId);
      const message = '계정이 성공적으로 연결되었습니다.';
      return {
        user,
        redirectPath: `/mypage#message=${encodeURIComponent(message)}`,
      };
    }

    const user = await this.usersService.findUserByOAuthId(
      oauthUser.provider,
      oauthUser.providerId,
    );

    if (user) {
      // 이미 연동된 유저라면 바로 리턴
      return { user };
    }

    const byEmail = await this.usersService.findUserByEmail(oauthUser.email);
    if (byEmail && byEmail.verified) {
      await this.usersService.linkOAuthAccount(byEmail.id, oauthUser);
      return { user: byEmail };
    }

    const created = await this.usersService.createUserFromOAuth(oauthUser);
    return { user: created };
  }

  async loginWithOAuth(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } = this.generateJwtToken(user);

    await this.usersService.setCurrentRefreshTokenHash(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const isProd = process.env.NODE_ENV === 'production';
    res
      .cookie('Authentication', accessToken, {
        httpOnly: true,
        signed: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60, // 1시간
      })
      .cookie('Refresh', refreshToken, {
        httpOnly: true,
        signed: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      });
  }

  async refreshTokens(
    oldToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!oldToken) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_005,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_005,
      });
    }

    let payload;
    try {
      payload = this.jwt.verify(oldToken, {
        secret: this.jwtCfg.refreshSecret,
      }) as { type: string; sub: number; email: string };
    } catch (error) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_002,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_002,
      });
    }

    await this.usersService.verifyRefreshToken(payload.sub, oldToken);

    const { accessToken, refreshToken } = this.generateJwtToken({
      id: payload.sub,
      email: payload.email,
    } as User);

    await this.usersService.setCurrentRefreshTokenHash(
      payload.sub,
      refreshToken,
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
