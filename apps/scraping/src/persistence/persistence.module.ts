import { Module } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class PersistenceModule {}
