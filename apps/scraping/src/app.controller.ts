import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';

@ApiTags('기본')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly auth: AuthService,
  ) {}

  @ApiOperation({ summary: '헬로 월드 메시지 반환' })
  @Get()
  getHello(): string {
    console.log(this.auth.generateDataIngestionToken());
    return this.appService.getHello();
  }
}
