import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  Matches,
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

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be in YYYY-MM-DD format',
  })
  dateFrom: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be in YYYY-MM-DD format',
  })
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
