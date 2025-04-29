import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWrapper } from './common/decorators/api-response.decorator';

@ApiTags('기본')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '헬로 월드 메시지 반환' })
  @ApiResponseWrapper(String)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
