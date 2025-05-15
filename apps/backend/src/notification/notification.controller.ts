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
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import { filter, map, tap } from 'rxjs/operators';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@ApiTags('알림')
@ApiBearerAuth('JWT-auth')
@Controller('/api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: '알림 스트림 구독',
    description: 'SSE를 통한 실시간 알림 스트림 구독',
  })
  @Sse('stream')
  stream(@Req() req): import('rxjs').Observable<MessageEvent> {
    const userId = req.user.id;
    return this.notificationService.notification$.pipe(
      filter((n) => n.userId === userId),
      map((n) => {
        return { data: n };
      }),
    );
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
  async getNotifications(
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
    return await this.notificationService.deleteUserNotification(
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

  // 실적 알림 엔드포인트
  @ApiOperation({ summary: '실적 알림 추가' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('earnings/:id')
  async addEarningsNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.addEarningsNotification(
      userId,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '실적 알림 제거' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Delete('earnings/:id')
  async removeEarningsNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.removeEarningsNotification(
      userId,
      parseInt(id),
    );
  }

  // 배당 알림 엔드포인트
  @ApiOperation({ summary: '배당 알림 추가' })
  @ApiParam({ name: 'id', description: '배당 ID' })
  @ApiResponseWrapper(Object)
  @Post('dividends/:id')
  async addDividendNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.addDividendNotification(
      userId,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '배당 알림 제거' })
  @ApiParam({ name: 'id', description: '배당 ID' })
  @ApiResponseWrapper(Object)
  @Delete('dividends/:id')
  async removeDividendNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.removeDividendNotification(
      userId,
      parseInt(id),
    );
  }

  // 경제지표 알림 엔드포인트
  @ApiOperation({ summary: '경제지표 알림 추가' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('economic-indicators/:id')
  async addEconomicIndicatorNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.addEconomicIndicatorNotification(
      userId,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '경제지표 알림 제거' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Delete('economic-indicators/:id')
  async removeEconomicIndicatorNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.removeEconomicIndicatorNotification(
      userId,
      parseInt(id),
    );
  }

  // 알림 설정된 캘린더 정보 조회
  @ApiOperation({ summary: '알림 설정된 캘린더 이벤트 조회' })
  @ApiResponseWrapper(Object, true)
  @Get('calendar')
  async getNotificationCalendar(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.notificationService.getNotificationCalendar(userId);
  }
}
