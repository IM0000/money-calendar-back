import { IsOptional, IsString } from 'class-validator';

export class SearchCompanyDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}

export class SearchIndicatorDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
