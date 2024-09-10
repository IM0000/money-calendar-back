// scrape.dto.ts
import { IsEnum, IsDateString } from 'class-validator';
import { Country } from './country.dto';

// ScrapeDto 정의
export class ScrapeDto {
  @IsEnum(Country, {
    message: `Country must be one of the following values: ${Object.values(
      Country,
    ).join(', ')}`,
  }) // country 유효성 검사
  country: Country;

  @IsDateString({}, { message: 'dateFrom must be a valid date string' }) // 날짜 형식 검사 YYYY-MM-DD
  dateFrom: string;

  @IsDateString({}, { message: 'dateTo must be a valid date string' }) // 날짜 형식 검사
  dateTo: string;
}
