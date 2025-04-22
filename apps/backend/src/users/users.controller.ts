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
  Inject,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UserDto } from '../auth/dto/users.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  UpdateProfileDto,
  UpdateUserPasswordDto,
  DeleteUserDto,
  VerifyPasswordDto,
} from './dto/profile.dto';
import { Request } from 'express';
import { NotificationService } from '../notification/notification.service';
import { UpdateUserNotificationSettingsDto } from '../notification/dto/notification.dto';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('api/v1/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

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
  @Patch('/profile/nickname')
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
  @Patch('/profile/password')
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
   * 계정 탈퇴
   */
  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Req() req: RequestWithUser,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    const userId = req.user.id;
    return this.usersService.deleteUser(
      userId,
      deleteUserDto.email,
      deleteUserDto.password,
    );
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

  /**
   * 사용자 알림 목록 조회
   */
  @Get('/me/notifications')
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const userId = req.user.id;
    return this.notificationService.getUserNotifications(
      userId,
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * 사용자 읽지 않은 알림 개수 조회
   */
  @Get('/me/notifications/unread/count')
  @UseGuards(JwtAuthGuard)
  async getUnreadNotificationsCount(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationService.getUnreadNotificationsCount(userId);
  }

  /**
   * 사용자 알림 설정 조회
   */
  @Get('/me/notification-settings')
  @UseGuards(JwtAuthGuard)
  async getNotificationSettings(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationService.getUserNotificationSettings(userId);
  }

  /**
   * 사용자 알림 설정 업데이트
   */
  @Put('/me/notification-settings')
  @UseGuards(JwtAuthGuard)
  async updateNotificationSettings(
    @Req() req: RequestWithUser,
    @Body() updateSettingsDto: UpdateUserNotificationSettingsDto,
  ) {
    const userId = req.user.id;
    return this.notificationService.updateUserNotificationSettings(
      userId,
      updateSettingsDto,
    );
  }

  /**
   * 현재 비밀번호 확인
   */
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
