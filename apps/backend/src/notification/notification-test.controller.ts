import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { NotificationTestService } from './notification-test.service';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

@ApiTags('알림 테스트')
@Controller('/api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationTestController {
  constructor(
    private readonly notificationTestService: NotificationTestService,
  ) {}

  @ApiOperation({ summary: '경제지표 테스트 값 설정' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('test-indicator/:id')
  async testIndicatorActual(@Param('id') id: string) {
    return await this.notificationTestService.testIndicatorActual(parseInt(id));
  }

  @ApiOperation({ summary: '경제지표 원상복구' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('restore-indicator/:id')
  async restoreIndicatorActual(@Param('id') id: string) {
    return await this.notificationTestService.restoreIndicatorActual(
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '실적 테스트 값 설정' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('test-earnings/:id')
  async testEarningsActual(@Param('id') id: string) {
    return await this.notificationTestService.testEarningsActual(parseInt(id));
  }

  @ApiOperation({ summary: '실적 원상복구' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('restore-earnings/:id')
  async restoreEarningsActual(@Param('id') id: string) {
    return await this.notificationTestService.restoreEarningsActual(
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '배당 데이터 테스트 값 설정' })
  @ApiParam({ name: 'id', description: '배당 ID' })
  @ApiResponseWrapper(Object)
  @Post('test-dividend/:id')
  async testDividendData(@Param('id') id: string) {
    return await this.notificationTestService.testDividendData(parseInt(id));
  }

  @ApiOperation({ summary: '배당 데이터 원상복구' })
  @ApiParam({ name: 'id', description: '배당 ID' })
  @ApiResponseWrapper(Object)
  @Post('restore-dividend/:id')
  async restoreDividendData(@Param('id') id: string) {
    return await this.notificationTestService.restoreDividendData(parseInt(id));
  }

  @ApiOperation({ summary: '배당 지급일 알림 테스트' })
  @ApiResponseWrapper(Object)
  @Post('test-dividend-payment')
  async testDividendPayment() {
    return await this.notificationTestService.testDividendPayment();
  }
}
