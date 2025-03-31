import {
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  CreateNotificationDto,
  UpdateNotificationSettingsDto,
  UpdateUserNotificationSettingsDto,
} from './dto/notification.dto';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Req() req: RequestWithUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = req.user.id;
    return this.notificationsService.getNotifications(userId, page, limit);
  }

  @Get('/unread-count')
  async getUnreadNotificationsCount(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationsService.getUnreadNotificationsCount(userId);
  }

  @Post()
  async createNotification(
    @Req() req: RequestWithUser,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const userId = req.user.id;
    return this.notificationsService.createNotification(
      userId,
      createNotificationDto,
    );
  }

  @Patch('/:id/read')
  async markAsRead(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) notificationId: number,
  ) {
    const userId = req.user.id;
    return this.notificationsService.markAsRead(userId, notificationId);
  }

  @Patch('/read-all')
  async markAllAsRead(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete('/:id')
  async deleteNotification(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) notificationId: number,
  ) {
    const userId = req.user.id;
    return this.notificationsService.deleteNotification(userId, notificationId);
  }

  @Get('/settings')
  async getUserNotificationSettings(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notificationsService.getUserNotificationSettings(userId);
  }

  @Patch('/settings')
  async updateUserNotificationSettings(
    @Req() req: RequestWithUser,
    @Body() updateSettingsDto: UpdateUserNotificationSettingsDto,
  ) {
    const userId = req.user.id;
    return this.notificationsService.updateUserNotificationSettings(
      userId,
      updateSettingsDto,
    );
  }

  @Patch('/:id/settings')
  async updateNotificationSettings(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) notificationId: number,
    @Body() updateSettingsDto: UpdateNotificationSettingsDto,
  ) {
    const userId = req.user.id;
    return this.notificationsService.updateNotificationSettings(
      userId,
      notificationId,
      updateSettingsDto,
    );
  }
}
