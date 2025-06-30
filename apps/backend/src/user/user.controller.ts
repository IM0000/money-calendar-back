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
  Query,
  Patch,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import {
  UpdateProfileDto,
  UpdateUserPasswordDto,
  DeleteUserDto,
  VerifyPasswordDto,
  UpdatePasswordDto,
  ProfileResponseDto,
} from './dto/profile.dto';
import { Request } from 'express';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@ApiTags('유저')
@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: '비밀번호 업데이트' })
  @ApiResponseWrapper(Object)
  @Put('/password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateUserPassword(
      updatePasswordDto.email,
      updatePasswordDto.password,
    );
    return { message: 'success' };
  }

  /**
   * 사용자 프로필 조회
   */
  @ApiOperation({ summary: '사용자 프로필 조회' })
  @ApiResponseWrapper(ProfileResponseDto)
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.usersService.getUserProfile(userId);
  }

  /**
   * 사용자 프로필 업데이트 (닉네임 등)
   */
  @ApiOperation({ summary: '사용자 닉네임 업데이트' })
  @ApiResponseWrapper(ProfileResponseDto)
  @Patch('/profile/nickname')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return await this.usersService.updateUserProfile(userId, updateProfileDto);
  }

  /**
   * 사용자 비밀번호 변경 (로그인된 상태에서)
   */
  @ApiOperation({ summary: '사용자 비밀번호 변경' })
  @ApiResponseWrapper(Object)
  @Patch('/profile/password')
  @UseGuards(JwtAuthGuard)
  async changeUserPassword(
    @Req() req: RequestWithUser,
    @Body() updatePasswordDto: UpdateUserPasswordDto,
  ) {
    const userId = req.user.id;
    return await this.usersService.changeUserPassword(
      userId,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  /**
   * 계정 탈퇴
   */
  @ApiOperation({ summary: '계정 탈퇴' })
  @ApiResponseWrapper(Object)
  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Req() req: RequestWithUser,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    const userId = req.user.id;
    return await this.usersService.deleteUser(
      userId,
      deleteUserDto.email,
      deleteUserDto.password,
    );
  }

  /**
   * OAuth 계정 연결 해제
   */
  @ApiOperation({ summary: 'OAuth 계정 연결 해제' })
  @ApiResponseWrapper(Object, false)
  @Delete('/profile/oauth/:provider')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async disconnectOAuthAccount(
    @Req() req: RequestWithUser,
    @Param('provider') provider: string,
  ) {
    const userId = req.user.id;
    return await this.usersService.disconnectOAuthAccount(userId, provider);
  }

  /**
   * 현재 비밀번호 확인
   */
  @ApiOperation({ summary: '현재 비밀번호 확인' })
  @ApiResponseWrapper(Object)
  @Post('/verify-password')
  @UseGuards(JwtAuthGuard)
  async verifyPassword(
    @Req() req: RequestWithUser,
    @Body() verifyPasswordDto: VerifyPasswordDto,
  ): Promise<{ isValid: boolean }> {
    const userId = req.user.id;
    const isValid = await this.usersService.verifyUserPassword(
      userId,
      verifyPasswordDto.password,
    );
    return { isValid };
  }
}
