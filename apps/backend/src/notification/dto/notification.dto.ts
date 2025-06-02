import { ContentType } from '@prisma/client';

// 새로운 스키마에 맞게 enum 정의
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserNotificationSettingsDto {
  @ApiProperty({ description: '이메일 알림 활성화 여부', required: false })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiProperty({ description: 'Slack 알림 활성화 여부', required: false })
  @IsBoolean()
  @IsOptional()
  slackEnabled?: boolean;

  @ApiProperty({
    description: 'Slack Webhook URL (slackEnabled가 true일 때 필수)',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  webhookUrl?: string;

  @ValidateIf((o) => o.slackEnabled === true && !o.webhookUrl)
  @IsNotEmpty({
    message: 'Slack 알림을 활성화할 때는 webhookUrl이 필요합니다.',
  })
  validateWebhookUrl() {
    return this.webhookUrl;
  }
}

export class SendNotificationEmailDto {
  @ApiProperty({ description: '수신자 이메일', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '이메일 제목' })
  @IsString()
  subject: string;

  @ApiProperty({ description: '이메일 내용' })
  @IsString()
  content: string;
}
