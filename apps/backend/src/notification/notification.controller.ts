import {
  Controller,
  Delete,
  Param,
  UseGuards,
  Get,
  Post,
  Put,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('/api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
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

  @Get('unread/count')
  async getUnreadCount(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationService.getUnreadNotificationsCount(userId);
  }

  @Put(':id/read')
  async markAsRead(@Req() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.id;
    return this.notificationService.markAsRead(userId, parseInt(id));
  }

  @Put('read/all')
  async markAllAsRead(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.deleteUserNotification(
      userId,
      parseInt(id),
    );
  }

  @Get('settings')
  async getNotificationSettings(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationService.getUserNotificationSettings(userId);
  }

  @Put('settings')
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

  // 실적 알림 엔드포인트
  @Post('earnings/:id')
  async addEarningsNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.addEarningsNotification(
      userId,
      parseInt(id),
    );
  }

  @Delete('earnings/:id')
  async removeEarningsNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.removeEarningsNotification(
      userId,
      parseInt(id),
    );
  }

  // 배당 알림 엔드포인트
  @Post('dividends/:id')
  async addDividendNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.addDividendNotification(
      userId,
      parseInt(id),
    );
  }

  @Delete('dividends/:id')
  async removeDividendNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.removeDividendNotification(
      userId,
      parseInt(id),
    );
  }

  // 경제지표 알림 엔드포인트
  @Post('economic-indicators/:id')
  async addEconomicIndicatorNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.addEconomicIndicatorNotification(
      userId,
      parseInt(id),
    );
  }

  @Delete('economic-indicators/:id')
  async removeEconomicIndicatorNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.notificationService.removeEconomicIndicatorNotification(
      userId,
      parseInt(id),
    );
  }

  // 알림 설정된 캘린더 정보 조회
  @Get('calendar')
  async getNotificationCalendar(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationService.getNotificationCalendar(userId);
  }
}
