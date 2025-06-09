import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { COUNTRY_CODE } from '../../common/constants/country-code.constant';

export class FavoriteIndicatorGroupDto {
  @ApiProperty({
    description: '즐겨찾기할 지표 그룹의 baseName (예: CPI)',
    example: 'CPI',
    type: String,
  })
  @IsNotEmpty({ message: '지표 그룹 baseName은 필수입니다.' })
  @IsString({ message: '지표 그룹 baseName은 문자열이어야 합니다.' })
  baseName: string;

  @ApiProperty({
    description: '즐겨찾기할 지표 그룹의 국가 코드 (예: USA)',
    example: 'USA',
    type: String,
  })
  @IsNotEmpty({ message: '지표 그룹 국가는 필수입니다.' })
  @IsString({ message: '지표 그룹 국가는 문자열이어야 합니다.' })
  country: COUNTRY_CODE;
}
