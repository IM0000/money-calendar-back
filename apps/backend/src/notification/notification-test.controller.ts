import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationTestService } from './notification-test.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

@ApiTags('알림 테스트')
@Controller('api/v1/notifications')
export class NotificationTestController {
  constructor(private readonly testService: NotificationTestService) {}

  @ApiOperation({
    summary: '경제지표 알림 테스트',
    description: '경제지표 실제 발표값 갱신을 시뮬레이션하여 알림 테스트',
  })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('test-indicator/:id')
  testIndicator(@Param('id', ParseIntPipe) id: number) {
    return this.testService.testIndicatorActual(id);
  }

  @ApiOperation({
    summary: '경제지표 원상복구',
    description: '테스트를 위해 변경된 경제지표 값을 원상복구',
  })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('restore-indicator/:id')
  restoreIndicator(@Param('id', ParseIntPipe) id: number) {
    return this.testService.restoreIndicatorActual(id);
  }

  @ApiOperation({
    summary: '실적 알림 테스트',
    description: '기업 실적 발표를 시뮬레이션하여 알림 테스트',
  })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('test-earnings/:id')
  testEarnings(@Param('id', ParseIntPipe) id: number) {
    return this.testService.testEarningsActual(id);
  }

  @ApiOperation({
    summary: '실적 원상복구',
    description: '테스트를 위해 변경된 실적 값을 원상복구',
  })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('restore-earnings/:id')
  restoreEarnings(@Param('id', ParseIntPipe) id: number) {
    return this.testService.restoreEarningsActual(id);
  }
}
