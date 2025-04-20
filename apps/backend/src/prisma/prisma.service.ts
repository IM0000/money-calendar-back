import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly eventEmitter: EventEmitter2) {
    super(); // ★ 옵션 없이 그냥 호출

    // 1) defineExtension으로 훅 정의
    const indicatorExt = Prisma.defineExtension((client) =>
      client.$extends({
        name: 'indicatorExt',
        query: {
          economicIndicator: {
            async update({ args, query }) {
              const before = await client.economicIndicator.findUnique({
                where: args.where,
              });
              const after = await query(args);
              if (before?.actual !== after.actual) {
                eventEmitter.emit('indicator.actualChanged', { before, after });
              }
              return after;
            },
          },
        },
      }),
    );
    const earningsExt = Prisma.defineExtension((client) =>
      client.$extends({
        name: 'earningsExt',
        query: {
          earnings: {
            async update({ args, query }) {
              const before = await client.earnings.findUnique({
                where: args.where,
                include: { company: true },
              });
              const after = await query(args);
              if (before?.actualEPS !== after.actualEPS) {
                eventEmitter.emit('earnings.actualChanged', { before, after });
              }
              return after;
            },
          },
        },
      }),
    );

    // 2) this.$extends 체인 → DynamicClientExtensionThis 반환
    const extended = this.$extends(indicatorExt).$extends(earningsExt);

    // 3) Object.assign으로 this(PrismaService)에 덮어쓰기
    Object.assign(this, extended);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
