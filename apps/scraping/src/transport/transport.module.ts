import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TransportService],
  exports: [TransportService],
})
export class TransportModule {}
