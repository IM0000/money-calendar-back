import {
  Controller,
  Delete,
  Param,
  UseGuards,
  Get,
  Put,
  Body,
  Query,
  Req,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';
import { RequestWithUser } from '../common/types/request-with-user';
import { NotificationSSEService } from './sse/notification-sse.service';

@ApiTags('알림')
@Controller('/api/v1/notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly sseService: NotificationSSEService,
  ) {}

  @ApiOperation({
    summary: '알림 스트림 구독',
    description: 'Redis Pub/Sub 기반 SSE를 통한 실시간 알림 스트림 구독',
  })
  @Sse('stream')
  stream(@Req() req: RequestWithUser): import('rxjs').Observable<MessageEvent> {
    const userId = req.user.id;
    return this.sseService.getNotificationStream(userId);
  }

  @ApiOperation({ summary: '알림 목록 조회' })
  @ApiQuery({
    name: 'page',
    description: '페이지 번호',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: '페이지당 항목 수',
    required: false,
    type: Number,
  })
  @ApiResponseWrapper(Object, true)
  @Get()
  async getNotification(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '100',
  ) {
    const userId = req.user.id;
    return await this.notificationService.getUserNotifications(
      userId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @ApiOperation({ summary: '읽지 않은 알림 개수 조회' })
  @ApiResponseWrapper(Object)
  @Get('unread/count')
  async getUnreadCount(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.notificationService.getUnreadNotificationsCount(userId);
  }

  @ApiOperation({ summary: '알림을 읽음으로 표시' })
  @ApiParam({ name: 'id', description: '알림 ID' })
  @ApiResponseWrapper(Object)
  @Put(':id/read')
  async markAsRead(@Req() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.notificationService.markAsRead(userId, parseInt(id));
  }

  @ApiOperation({ summary: '모든 알림을 읽음으로 표시' })
  @ApiResponseWrapper(Object)
  @Put('read/all')
  async markAllAsRead(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.notificationService.markAllAsRead(userId);
  }

  @ApiOperation({ summary: '모든 알림 삭제' })
  @ApiResponseWrapper(Object)
  @Delete('all')
  async deleteAllNotifications(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.notificationService.deleteAllUserNotifications(userId);
  }

  @ApiOperation({ summary: '특정 알림 삭제' })
  @ApiParam({ name: 'id', description: '알림 ID' })
  @ApiResponseWrapper(Object)
  @Delete(':id(\\d+)')
  async deleteNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.deleteNotification(
      userId,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '알림 설정 조회' })
  @ApiResponseWrapper(Object)
  @Get('settings')
  async getNotificationSettings(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.notificationService.getUserNotificationSettings(userId);
  }

  @ApiOperation({ summary: '알림 설정 업데이트' })
  @ApiResponseWrapper(Object)
  @Put('settings')
  async updateNotificationSettings(
    @Req() req: RequestWithUser,
    @Body() updateSettingsDto: UpdateUserNotificationSettingsDto,
  ) {
    const userId = req.user.id;
    return await this.notificationService.updateUserNotificationSettings(
      userId,
      updateSettingsDto,
    );
  }

  @ApiOperation({ summary: 'SSE 연결 상태 확인' })
  @ApiResponseWrapper(Object)
  @Get('sse/health')
  async checkSSEHealth() {
    const isConnected = this.sseService.isConnected();
    const connectionTest = await this.sseService.testConnection();

    return {
      status: isConnected && connectionTest ? 'healthy' : 'unhealthy',
      redis: {
        connected: isConnected,
        pingTest: connectionTest,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
