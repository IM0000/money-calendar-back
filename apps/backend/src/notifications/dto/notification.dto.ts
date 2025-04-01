import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsInt()
  @IsNotEmpty()
  contentId: number;
}

export class NotificationResponseDto {
  id: number;
  type: NotificationType;
  contentId: number;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationMethod {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  BOTH = 'BOTH',
}

export enum NotificationTiming {
  ONE_HOUR_BEFORE = 'ONE_HOUR_BEFORE',
  THREE_HOURS_BEFORE = 'THREE_HOURS_BEFORE',
  ONE_DAY_BEFORE = 'ONE_DAY_BEFORE',
  THREE_DAYS_BEFORE = 'THREE_DAYS_BEFORE',
  ONE_WEEK_BEFORE = 'ONE_WEEK_BEFORE',
}

export class UpdateUserNotificationSettingsDto {
  @IsOptional()
  @IsEnum(NotificationMethod)
  preferredMethod?: NotificationMethod;

  @IsOptional()
  @IsEnum(NotificationTiming)
  defaultTiming?: NotificationTiming;

  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;
}

export class UpdateNotificationSettingsDto {
  @IsInt()
  @IsNotEmpty()
  notificationId: number;

  @IsOptional()
  @IsEnum(NotificationMethod)
  method?: NotificationMethod;

  @IsOptional()
  @IsEnum(NotificationTiming)
  timing?: NotificationTiming;
}
