// src/calendar/dto/get-calendar.dto.ts
import { IsNotEmpty, Matches } from 'class-validator';

export class GetCalendarDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate format error',
  })
  startDate: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate format error',
  })
  endDate: string;
}
