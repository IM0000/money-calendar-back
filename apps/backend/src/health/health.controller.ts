import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    // private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @ApiOperation({
    summary: '서비스 상태 확인',
    description: 'API 서버, 데이터베이스 및 메모리 상태를 확인합니다.',
  })
  @Get()
  @HealthCheck()
  check() {
    try {
      return this.health.check([
        () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
        () =>
          this.prismaIndicator.pingCheck('postgres', this.prisma, {
            timeout: 1000,
          }),
        () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      ]);
    } catch (error) {
      console.error('Health Check Failed:', error.details);
      throw error;
    }
  }
}
