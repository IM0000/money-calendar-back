import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationTestService } from './notification-test.service';

@Controller('api/v1/notifications')
export class NotificationTestController {
  constructor(private readonly testService: NotificationTestService) {}

  @Post('test-indicator/:id')
  testIndicator(@Param('id', ParseIntPipe) id: number) {
    return this.testService.testIndicatorActual(id);
  }

  @Post('restore-indicator/:id')
  restoreIndicator(@Param('id', ParseIntPipe) id: number) {
    return this.testService.restoreIndicatorActual(id);
  }

  @Post('test-earnings/:id')
  testEarnings(@Param('id', ParseIntPipe) id: number) {
    return this.testService.testEarningsActual(id);
  }

  @Post('restore-earnings/:id')
  restoreEarnings(@Param('id', ParseIntPipe) id: number) {
    return this.testService.restoreEarningsActual(id);
  }
}
