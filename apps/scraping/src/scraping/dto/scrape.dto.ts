import {
  IsEnum,
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Country {
  USA = 'USA',
}

export class ProxyConfigDto {
  @IsString({ message: 'proxyConfig.host must be a string' })
  host: string;

  @IsNumber({}, { message: 'proxyConfig.port must be a number' })
  port: number;

  @IsOptional()
  @IsString({ message: 'proxyConfig.protocol must be a string if provided' })
  protocol?: string;
}

export class ScrapeDto {
  @IsEnum(Country, {
    message: `Country must be one of the following values: ${Object.values(
      Country,
    ).join(', ')}`,
  })
  country: Country;

  @IsDateString({}, { message: 'dateFrom must be a valid date string' }) // 날짜 형식 검사 YYYY-MM-DD
  dateFrom: string;

  @IsDateString({}, { message: 'dateTo must be a valid date string' }) // 날짜 형식 검사
  dateTo: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProxyConfigDto)
  proxyConfig?: ProxyConfigDto;
}

export class ScrapeCompanyDto {
  @IsEnum(Country, {
    message: `Country must be one of the following values: ${Object.values(
      Country,
    ).join(', ')}`,
  })
  country: Country;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProxyConfigDto)
  proxyConfig?: ProxyConfigDto;
}
