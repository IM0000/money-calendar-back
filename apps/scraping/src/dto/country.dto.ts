// country.dto.ts
import { IsEnum } from 'class-validator';

// Country enum을 정의합니다.
export enum Country {
  USA = 'USA',
  KOR = 'KOR',
  JPN = 'JPN',
}

// DTO 클래스에서 Country enum을 사용하여 유효성 검사를 설정합니다.
export class ScrapeCompanyDto {
  @IsEnum(Country, {
    message: `Country must be one of the following values: ${Object.values(
      Country,
    ).join(', ')}`,
  })
  country: Country;
}
