// /auth/auth.controller.ts
import {
  Controller,
  Get,
  Query,
  Res,
  Param,
  Inject,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthStrategy } from './oauth/oauth-strategy.interface';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';
import { VerifyDto } from '../users/dto/verify.dto';
import { LoginDto } from '../users/dto/login.dto';
import { DynamicAuthGuard } from './guard/dynamic-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @Inject('OAUTH_STRATEGIES') private readonly strategies: OAuthStrategy[],
  ) {}

  /**
   * OAuth 로그인 요청 처리 (공통 엔드포인트)
   * @param provider OAuth 제공자 이름
   * @param res 응답 객체
   */
  @Get(':provider')
  @UseGuards(DynamicAuthGuard)
  async oauthLogin(@Res() res: any) {
    console.log('OAuth login initiated');
    return;
  }

  /**
   * OAuth 콜백 처리 (공통 엔드포인트)
   * @param provider OAuth 제공자 이름
   * @param query OAuth 제공자로부터 받은 쿼리 파라미터
   * @param res 응답 객체
   */
  @Get(':provider/callback')
  @UseGuards(DynamicAuthGuard)
  async oauthCallback(
    @Param('provider') provider: string,
    @Query() query: any,
    @Res() res: any,
  ) {
    console.log('OAuth callback received');
  }

  /**
   * 이메일로 인증 코드 요청
   * @param registerDto 이메일 주소
   */
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    const { email } = registerDto;
    await this.usersService.sendVerificationCode(email);
    return { message: '인증 코드가 이메일로 전송되었습니다.' };
  }

  /**
   * 인증 코드 검증 및 비밀번호 설정
   * @param verifyDto 이메일, 인증 코드, 비밀번호
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() verifyDto: VerifyDto): Promise<{ message: string }> {
    const { email, code, password } = verifyDto;
    await this.usersService.verifyCode(email, code);
    await this.usersService.createUserByEmail(email, password);
    return { message: '회원가입이 완료되었습니다.' };
  }

  /**
   * 이메일과 비밀번호로 로그인
   * @param loginDto 이메일, 비밀번호
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.loginWithEmail(loginDto);
  }
}
