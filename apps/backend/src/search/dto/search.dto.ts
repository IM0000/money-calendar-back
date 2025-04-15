import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchCompanyDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(0)
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
  @IsInt()
  @Min(0)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number = 10;
}
