import {
  IsArray,
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SourceName {
  EconomicIndicator = 'economic-indicator',
  Dividend = 'dividend',
  Earnings = 'earnings',
  Company = 'company',
}

export class IngestDto {
  @IsEnum(SourceName)
  sourceName: SourceName;

  @IsArray()
  @ValidateNested({ each: true })
  @Type((options) => {
    switch ((options.object as IngestDto).sourceName) {
      case SourceName.Company:
        return CompanyDto;
      case SourceName.EconomicIndicator:
        return EconomicIndicatorDto;
      case SourceName.Earnings:
        return EarningsDto;
      case SourceName.Dividend:
        return DividendDto;
      default:
        return Object;
    }
  })
  data: CompanyDto[] | EconomicIndicatorDto[] | EarningsDto[] | DividendDto[];
}

export class CompanyDto {
  @IsString()
  ticker: string;

  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsString()
  marketValue: string;
}

export class EconomicIndicatorDto {
  @IsString()
  country: string;

  @IsNumber()
  @Type(() => Number)
  releaseDate: bigint;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  importance: number;

  @IsString()
  actual: string;

  @IsString()
  forecast: string;

  @IsOptional()
  @IsString()
  previous?: string;
}

export enum ReleaseTiming {
  UNKNOWN = 'UNKNOWN',
  PRE_MARKET = 'PRE_MARKET',
  POST_MARKET = 'POST_MARKET',
}

export class EarningsDto {
  @IsString()
  ticker: string;

  @IsString()
  country: string;

  @IsNumber()
  @Type(() => Number)
  releaseDate: bigint;

  @IsEnum(ReleaseTiming)
  releaseTiming: ReleaseTiming;

  @IsString()
  actualEPS: string;

  @IsString()
  forecastEPS: string;

  @IsOptional()
  @IsString()
  previousEPS?: string;

  @IsString()
  actualRevenue: string;

  @IsString()
  forecastRevenue: string;

  @IsOptional()
  @IsString()
  previousRevenue?: string;
}

export class DividendDto {
  @IsString()
  ticker: string;

  @IsString()
  country: string;

  @IsNumber()
  @Type(() => Number)
  exDividendDate: bigint;

  @IsString()
  dividendAmount: string;

  @IsOptional()
  @IsString()
  previousDividendAmount?: string;

  @IsNumber()
  @Type(() => Number)
  paymentDate: bigint;

  @IsString()
  dividendYield: string;
}
