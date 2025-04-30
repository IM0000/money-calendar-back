import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDate } from '../../common/decorators/is-valid-date.decorator';
import { ApiProperty } from '@nestjs/swagger';

export enum Country {
  USA = 'USA',
}

export class ProxyConfigDto {
  @ApiProperty({ description: '프록시 호스트', example: 'proxy.example.com' })
  @IsString({ message: 'proxyConfig.host must be a string' })
  host: string;

  @ApiProperty({ description: '프록시 포트', example: 8080 })
  @IsNumber({}, { message: 'proxyConfig.port must be a number' })
  port: number;

  @ApiProperty({
    description: '프록시 프로토콜',
    example: 'http',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'proxyConfig.protocol must be a string if provided' })
  protocol?: string;
}

export class ScrapeDto {
  @ApiProperty({ description: '국가 코드', enum: Country, example: 'USA' })
  @IsEnum(Country, {
    message: `Country must be one of the following values: ${Object.values(
      Country,
    ).join(', ')}`,
  })
  country: Country;

  @ApiProperty({
    description: '시작 날짜 (YYYYMMDD 형식)',
    example: '20230101',
  })
  @IsValidDate({
    message: 'dateTo must be a real calendar date in YYYYMMDD format',
  })
  dateFrom: string;

  @ApiProperty({
    description: '종료 날짜 (YYYYMMDD 형식)',
    example: '20231231',
  })
  @IsValidDate({
    message: 'dateTo must be a real calendar date in YYYYMMDD format',
  })
  dateTo: string;

  @ApiProperty({
    description: '프록시 설정',
    required: false,
    type: ProxyConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProxyConfigDto)
  proxyConfig?: ProxyConfigDto;
}

export class ScrapeCompanyDto {
  @ApiProperty({ description: '국가 코드', enum: Country, example: 'USA' })
  @IsEnum(Country, {
    message: `Country must be one of the following values: ${Object.values(
      Country,
    ).join(', ')}`,
  })
  country: Country;

  @ApiProperty({
    description: '프록시 설정',
    required: false,
    type: ProxyConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProxyConfigDto)
  proxyConfig?: ProxyConfigDto;
}
