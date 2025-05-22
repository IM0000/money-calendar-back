import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { urlConfig } from '../config/url.config';

@Module({
  imports: [ConfigModule.forFeature(urlConfig), AuthModule],
  providers: [TransportService],
  exports: [TransportService],
})
export class TransportModule {}
