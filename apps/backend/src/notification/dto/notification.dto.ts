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
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Slack 웹훅 URL 정규식
const SLACK_WEBHOOK_URL_REGEX =
  /^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Za-z0-9]+$/;

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
    example:
      'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @ValidateIf((o) => o.slackEnabled === true)
  @IsNotEmpty({
    message: 'Slack 알림을 활성화할 때는 slackWebhookUrl이 필요합니다.',
  })
  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  @Matches(SLACK_WEBHOOK_URL_REGEX, {
    message:
      '올바른 Slack 웹훅 URL 형식이 아닙니다. (예: https://hooks.slack.com/services/...)',
  })
  @IsOptional()
  slackWebhookUrl?: string;

  @ApiProperty({ description: '모든 알림 활성화 여부', required: false })
  @IsBoolean()
  @IsOptional()
  allEnabled?: boolean;
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
