// src/calendar/dto/get-calendar.dto.ts
import {
  IsNotEmpty,
  Matches,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetCalendarDto {
  @IsNotEmpty({ message: '시작 날짜는 필수 입력값입니다' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '시작 날짜는 YYYY-MM-DD 형식이어야 합니다',
  })
  @IsDateString({}, { message: '유효한 날짜를 입력해주세요' })
  startDate: string;

  @IsNotEmpty({ message: '종료 날짜는 필수 입력값입니다' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '종료 날짜는 YYYY-MM-DD 형식이어야 합니다',
  })
  @IsDateString({}, { message: '유효한 날짜를 입력해주세요' })
  endDate: string;
}

export class GetCompanyHistoryDto {
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  limit = 5;
}

export class GetIndicatorGroupHistoryDto {
  @IsNotEmpty({ message: '지표명은 필수 입력값입니다' })
  @IsString({ message: '지표명은 문자열이어야 합니다' })
  baseName: string;

  @IsOptional()
  @IsString({ message: '국가는 문자열이어야 합니다' })
  country?: string;

  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  limit = 10;
}
