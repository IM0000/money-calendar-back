import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  // 이메일과 비밀번호를 사용하는 로그인
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginWithEmail(loginDto);
  }

  // OAuth 로그인
  @Post('login/oauth')
  async oauthLogin(@Req() req: any) {
    const provider = req.query.provider; // OAuth provider (google, facebook 등)
    return this.authService.loginWithOAuth(provider, req);
  }
}
