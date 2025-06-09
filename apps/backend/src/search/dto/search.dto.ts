import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCompanyDto {
  @ApiProperty({ description: '검색어', required: false, example: 'apple' })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ description: '국가 코드', required: false, example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: '페이지 번호', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 항목 수',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number = 10;
}

export class SearchIndicatorDto {
  @ApiProperty({ description: '검색어', required: false, example: 'cpi' })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ description: '국가 코드', required: false, example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: '페이지 번호', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 항목 수',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number = 10;
}
