import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDate } from '../../common/decorators/is-valid-date.decorator';

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

  @IsValidDate({
    message: 'dateTo must be a real calendar date in YYYYMMDD format',
  })
  dateFrom: string;

  @IsValidDate({
    message: 'dateTo must be a real calendar date in YYYYMMDD format',
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
