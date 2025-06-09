import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports: [PrismaModule, AuthModule, FavoriteModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
