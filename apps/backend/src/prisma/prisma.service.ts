// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, EconomicIndicator, Earnings } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly eventEmitter: EventEmitter2) {
    super({
      // (필요시 로깅, 에러 핸들러 등 옵션 추가)
    });

    // Prisma 미들웨어로 변경 감지
    this.$use(async (params, next) => {
      // 경제지표 업데이트 전후 비교
      if (params.model === 'EconomicIndicator' && params.action === 'update') {
        const before = (await this.economicIndicator.findUnique({
          where: params.args.where,
        })) as EconomicIndicator | null;

        const result = await next(params);

        if (before && before.actual !== (result as EconomicIndicator).actual) {
          this.eventEmitter.emit('indicator.actualChanged', {
            before,
            after: result,
          });
        }
        return result;
      }

      // 실적 업데이트 전후 비교
      if (params.model === 'Earnings' && params.action === 'update') {
        const before = (await this.earnings.findUnique({
          where: params.args.where,
          include: { company: true },
        })) as Earnings | null;

        const result = await next(params);

        if (before && before.actualEPS !== (result as Earnings).actualEPS) {
          this.eventEmitter.emit('earnings.actualChanged', {
            before,
            after: result,
          });
        }
        return result;
      }

      // 그 외 쿼리는 그대로
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
