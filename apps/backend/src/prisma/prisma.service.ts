import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();

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

    const dividendExt = Prisma.defineExtension((client) =>
      client.$extends({
        name: 'dividendExt',
        query: {
          dividend: {
            async update({ args, query }) {
              const before = await client.dividend.findUnique({
                where: args.where,
                include: { company: true },
              });
              const after = await query(args);
              // 배당금이나 배당수익률이 변경된 경우
              if (
                before?.dividendAmount !== after.dividendAmount ||
                before?.dividendYield !== after.dividendYield
              ) {
                eventEmitter.emit('dividend.dataChanged', { before, after });
              }
              return after;
            },
          },
        },
      }),
    );

    const extended = this.$extends(indicatorExt)
      .$extends(earningsExt)
      .$extends(dividendExt);

    Object.assign(this, extended);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
