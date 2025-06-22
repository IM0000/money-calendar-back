import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { NotificationQueueService } from './notification-queue.service';
import { ApiResponseWrapper } from '../../common/decorators/api-response.decorator';

/**
 * 알림 큐 관리 컨트롤러
 * 큐 상태 조회 및 관리 기능 제공
 */
@ApiTags('알림 큐 관리')
@Controller('/api/v1/notification/queue')
@UseGuards(JwtAuthGuard)
export class NotificationQueueController {
  constructor(private readonly queueService: NotificationQueueService) {}

  @ApiOperation({
    summary: '큐 상태 조회',
    description: '현재 큐의 대기, 처리 중, 완료, 실패 작업 수를 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('status')
  async getQueueStatus() {
    return await this.queueService.getQueueStatus();
  }

  @ApiOperation({
    summary: '실패한 작업 재시도',
    description: '실패한 모든 작업을 재시도합니다.',
  })
  @ApiResponseWrapper(Object)
  @Post('retry-failed')
  async retryFailedJobs() {
    const retryCount = await this.queueService.retryFailedJobs();
    return {
      message: `${retryCount}개의 작업을 재시도했습니다.`,
      retryCount,
    };
  }
}
