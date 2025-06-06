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
import { filter, map } from 'rxjs/operators';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';
import { ContentType } from '@prisma/client';
import { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('알림')
@ApiBearerAuth('JWT-auth')
@Controller('/api/v1/notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: '알림 스트림 구독',
    description: 'SSE를 통한 실시간 알림 스트림 구독',
  })
  @Sse('stream')
  stream(@Req() req: RequestWithUser): import('rxjs').Observable<MessageEvent> {
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

  @ApiOperation({ summary: '특정 실적 구독 추가' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('earnings/:id')
  async addEarningsSubscription(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.subscribeContent(
      userId,
      ContentType.EARNINGS,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '특정 실적 구독 제거' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Delete('earnings/subscription/:id')
  async removeEarningsSubscription(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.unsubscribeContent(
      userId,
      ContentType.EARNINGS,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '특정 경제지표 구독 추가' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('economic-indicators/:id')
  async addEconomicIndicatorSubscription(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.subscribeContent(
      userId,
      ContentType.ECONOMIC_INDICATOR,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '특정 경제지표 구독 제거' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Delete('economic-indicators/subscription/:id')
  async removeEconomicIndicatorSubscription(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.unsubscribeContent(
      userId,
      ContentType.ECONOMIC_INDICATOR,
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '구독 정보 조회' })
  @ApiResponseWrapper(Object)
  @Get('subscriptions')
  async getUserSubscriptions(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.notificationService.getUserSubscriptions(userId);
  }

  @ApiOperation({ summary: '특정 기업의 모든 실적 알림 해제' })
  @ApiParam({ name: 'companyId', description: '기업 ID' })
  @ApiResponseWrapper(Object)
  @Delete('company/:companyId/earnings')
  async unsubscribeCompanyEarnings(
    @Req() req: RequestWithUser,
    @Param('companyId') companyId: string,
  ) {
    const userId = req.user.id;
    return await this.notificationService.unsubscribeCompanyEarnings(
      userId,
      parseInt(companyId),
    );
  }

  @ApiOperation({ summary: '특정 국가의 특정 경제지표 유형 모든 알림 해제' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        baseName: {
          type: 'string',
          description: '경제지표 기본 이름 (예: CPI, PPI 등)',
          example: '소비자물가지수',
        },
        country: {
          type: 'string',
          description: '국가 코드 (예: US, KR 등)',
          example: 'KR',
        },
      },
      required: ['baseName', 'country'],
    },
  })
  @ApiResponseWrapper(Object)
  @Delete('base-name-indicator')
  async unsubscribeBaseNameIndicator(
    @Req() req: RequestWithUser,
    @Body() body: { baseName: string; country: string },
  ) {
    const userId = req.user.id;
    return await this.notificationService.unsubscribeBaseNameIndicator(
      userId,
      body.baseName,
      body.country,
    );
  }
}
