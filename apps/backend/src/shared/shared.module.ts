// apps/backend/src/shared/shared.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Global()
@Module({
  providers: [PrismaService, EmailService],
  exports: [PrismaService, EmailService],
})
export class SharedModule {}
