import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UserDto } from '../auth/dto/users.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  UpdateProfileDto,
  UpdateUserPasswordDto,
  OAuthConnectionDto,
} from './dto/profile.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    console.log(updatePasswordDto);
    await this.usersService.updateUserPassword(
      updatePasswordDto.email,
      updatePasswordDto.password,
    );
    return { message: 'success' };
  }

  @Post('/email')
  async getUserByEmail(@Body('email') email: string): Promise<UserDto | null> {
    return this.usersService.findUserByEmail(email);
  }

  /**
   * 사용자 프로필 조회
   */
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.usersService.getUserProfile(userId);
  }

  /**
   * 사용자 프로필 업데이트 (닉네임 등)
   */
  @Put('/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.usersService.updateUserProfile(userId, updateProfileDto);
  }

  /**
   * 사용자 비밀번호 변경 (로그인된 상태에서)
   */
  @Put('/profile/password')
  @UseGuards(JwtAuthGuard)
  async changeUserPassword(
    @Req() req: RequestWithUser,
    @Body() updatePasswordDto: UpdateUserPasswordDto,
  ) {
    const userId = req.user.id;
    return this.usersService.changeUserPassword(
      userId,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  /**
   * OAuth 계정 연결
   */
  @Post('/profile/oauth')
  @UseGuards(JwtAuthGuard)
  async connectOAuthAccount(
    @Req() req: RequestWithUser,
    @Body() oauthConnectionDto: OAuthConnectionDto,
  ) {
    const { provider } = oauthConnectionDto;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // 유효한 OAuth 제공자인지 확인
    const validProviders = ['google', 'apple', 'discord', 'kakao'];
    if (!validProviders.includes(provider)) {
      throw new Error(`지원하지 않는 OAuth 제공자입니다: ${provider}`);
    }

    // OAuth 인증 요청 URL을 반환
    // oauthMethod=connect 파라미터를 추가하여 auth 모듈에서 계정 연결 요청임을 인식
    return {
      message: '계정 연결을 위해 OAuth 인증 페이지로 이동하세요.',
      redirectUrl: `/api/v1/auth/oauth/${provider}?oauthMethod=connect`,
    };
  }

  /**
   * OAuth 계정 연결 해제
   */
  @Delete('/profile/oauth/:provider')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async disconnectOAuthAccount(
    @Req() req: RequestWithUser,
    @Param('provider') provider: string,
  ) {
    const userId = req.user.id;
    return this.usersService.disconnectOAuthAccount(userId, provider);
  }
}
