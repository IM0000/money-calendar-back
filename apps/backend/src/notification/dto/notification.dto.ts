import { ContentType, NotificationMethod } from '@prisma/client';
import {
  IsNumber,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: '알림 콘텐츠 타입', enum: ContentType })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiProperty({ description: '콘텐츠 ID' })
  @IsNumber()
  contentId: number;

  @ApiProperty({ description: '사용자 ID' })
  @IsNumber()
  userId: number;
}

export class UpdateUserNotificationSettingsDto {
  @ApiProperty({ description: '이메일 알림 활성화 여부', required: false })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiProperty({ description: '푸시 알림 활성화 여부', required: false })
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @ApiProperty({
    description: '선호하는 알림 방식',
    required: false,
    example: 'EMAIL',
  })
  @IsString()
  @IsOptional()
  preferredMethod?: string;
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
