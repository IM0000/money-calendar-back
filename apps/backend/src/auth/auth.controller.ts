// /auth/auth.controller.ts
import {
  Controller,
  Get,
  Query,
  Res,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/users.dto';
import { OAuthConnectionDto, VerifyDto } from './dto/auth.dto';
import { LoginDto } from './dto/auth.dto';
import { DynamicAuthGuard } from './oauth/dynamic-auth.guard';
import { UserDto } from './dto/users.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request-with-user';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';
import { Request, Response } from 'express';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';

@ApiTags('인증')
@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * OAuth 로그인 요청 처리 (공통 엔드포인트)
   * @param provider OAuth 제공자 이름
   * @param req 응답 객체
   */
  @ApiOperation({ summary: 'OAuth 로그인 요청' })
  @ApiParam({
    name: 'provider',
    description: 'OAuth 제공자(google, kakao 등)',
    example: 'google',
  })
  @Get('oauth/:provider')
  @UseGuards(DynamicAuthGuard)
  async oauthLogin(@Param('provider') provider: string) {
    this.logger.log('oauthLogin : ' + provider);
  }

  /**
   * OAuth 콜백 처리 (공통 엔드포인트)
   * @param provider OAuth 제공자 이름
   * @param query OAuth 제공자로부터 받은 쿼리 파라미터
   * @param res 응답 객체
   */
  @ApiOperation({ summary: 'OAuth 로그인 콜백 처리' })
  @ApiParam({
    name: 'provider',
    description: 'OAuth 제공자(google, kakao 등)',
    example: 'google',
  })
  @Get('oauth/:provider/callback')
  @UseGuards(DynamicAuthGuard)
  async oauthCallback(
    @Param('provider') provider: string,
    @Query() query: any,
    @Req() req: any,
    @Res() res: any,
  ) {
    this.logger.log('callback query : ', query);
    const frontendURL = this.authService.getFrontendUrl();
    const oauthUser = req.user;
    this.logger.log(
      `OAuth callback: provider=${provider}, user=${JSON.stringify(oauthUser)}`,
    );

    if (!oauthUser) {
      return res.redirect(
        `${frontendURL}/auth/error?errorCode=${ERROR_CODE_MAP.AUTH_002}` +
          `&message=${ERROR_MESSAGE_MAP.AUTH_002}`,
      );
    }

    // (1) state 유무에 따른 처리 + 사용자 찾기/생성
    const state = req.query.state;
    const { user, redirectPath } = await this.authService.handleOAuthLogin(
      oauthUser,
      state,
    );

    const { accessToken, refreshToken } = await this.authService.loginWithOAuth(
      user,
    );
    this.authService.setAuthCookies(res, accessToken, refreshToken);

    return res.redirect(`${frontendURL}${redirectPath ?? '/auth/success'}`);
  }

  /**
   * 이메일로 인증 코드 요청
   * @param registerDto 이메일 주소
   */
  @ApiOperation({ summary: '이메일 인증 코드 요청' })
  @ApiResponseWrapper(Object)
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ token: string; message: string }> {
    const { email } = registerDto;
    await this.usersService.sendVerificationCode(email);
    const emailVerificationToken =
      await this.authService.generateVerificationToken(email);
    return {
      token: emailVerificationToken,
      message: '인증 코드가 이메일로 전송되었습니다.',
    };
  }

  /**
   * 인증 코드 검증
   * @param verifyDto 이메일, 인증 코드
   * @returns 상태 업데이트 된 유저 객체
   */
  @ApiOperation({ summary: '인증 코드 검증' })
  @ApiResponseWrapper(UserDto)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmailCode(@Body() verifyDto: VerifyDto): Promise<UserDto> {
    const { email, code } = verifyDto;
    const user = await this.usersService.verifyEmailCode(email, code);
    return user;
  }

  /**
   * 이메일 인증 token을 받고 토큰 확인 후 email을 반환
   * @param token 이메일토큰
   * @returns email
   */
  @ApiOperation({ summary: '이메일 인증 토큰 검증' })
  @ApiQuery({ name: 'token', description: '이메일 인증 토큰' })
  @ApiResponseWrapper(Object)
  @Get('email-verification')
  async getVerifyEmail(
    @Query('token') token: string,
  ): Promise<{ email: string }> {
    const email = await this.usersService.findEmailFromVerificationToken(token);
    return { email };
  }

  /**
   * 로그인 처리
   * @param loginDto 이메일, 비밀번호
   * @returns 액세스 토큰 포함 로그인 정보
   */
  @ApiOperation({ summary: '로그인' })
  @ApiResponseWrapper(Object)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    const { accessToken, refreshToken, user } =
      await this.authService.loginWithEmail(loginDto);

    this.authService.setAuthCookies(res, accessToken, refreshToken);

    return res.json({ user });
  }

  /**
   * 현재 로그인 상태 확인 (JWT 토큰 검증)
   */
  @ApiOperation({ summary: '로그인 상태 확인' })
  @ApiBearerAuth('Authentication')
  @ApiResponseWrapper(Object)
  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Req() req: RequestWithUser) {
    return { isAuthenticated: true, user: req.user };
  }

  /**
   * OAuth 계정 연결
   */
  @ApiOperation({ summary: 'OAuth 계정 연결' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponseWrapper(Object)
  @Post('oauth/connect')
  @UseGuards(JwtAuthGuard)
  connectOAuthAccount(
    @Req() req: RequestWithUser,
    @Body() oauthConnectionDto: OAuthConnectionDto,
  ) {
    const userId = req.user.id;
    const { provider } = oauthConnectionDto;

    // auth/oauth/google?connect=true 형식으로 리다이렉트 시킬 수 있도록 state 토큰 생성
    const stateToken = this.authService.generateOAuthStateToken(
      userId,
      provider,
    );
    const frontendURL = this.authService.getFrontendUrl();

    return {
      redirectUrl: `${frontendURL}/api/v1/auth/oauth/${provider}?state=${stateToken}`,
    };
  }

  /**
   * 비밀번호 재설정 이메일 요청
   */
  @ApiOperation({ summary: '비밀번호 재설정 이메일 요청' })
  @ApiResponseWrapper(Object)
  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body('email') email: string) {
    await this.authService.sendPasswordResetEmail(email);
    return { message: '비밀번호 재설정 이메일이 전송되었습니다.' };
  }

  /**
   * 비밀번호 재설정 토큰 검증
   */
  @ApiOperation({ summary: '비밀번호 재설정 토큰 검증' })
  @ApiQuery({ name: 'token', description: '비밀번호 재설정 토큰' })
  @ApiResponseWrapper(Object)
  @Get('password-reset/verify')
  async verifyResetToken(
    @Query('token') token: string,
  ): Promise<{ email: string }> {
    const { email } = this.authService.verifyPasswordResetToken(token);
    return { email };
  }

  /**
   * 비밀번호 변경 (토큰 & new password)
   */
  @ApiOperation({ summary: '비밀번호 재설정' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: '비밀번호 재설정 토큰' },
        password: { type: 'string', description: '새 비밀번호' },
      },
    },
  })
  @ApiResponseWrapper(Object)
  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: { token: string; password: string }) {
    const { token, password } = dto;
    const { email } = this.authService.verifyPasswordResetToken(token);
    await this.usersService.updateUserPassword(email, password);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const oldToken = req.signedCookies?.Refresh;
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      oldToken,
    );

    this.authService.setAuthCookies(res, accessToken, refreshToken);
    res.json({ message: '토큰이 갱신되었습니다.' });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user;
    if (user) {
      await this.usersService.removeRefreshTokenHash(user.id);
    }
    res
      .clearCookie('Authentication', {
        httpOnly: true,
        signed: true,
        path: '/',
      })
      .clearCookie('Refresh', { httpOnly: true, signed: true, path: '/' })
      .json({ message: '로그아웃되었습니다.' });
  }
}
