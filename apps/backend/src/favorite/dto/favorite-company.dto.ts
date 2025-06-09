import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteCompanyDto {
  @ApiProperty({
    description: '즐겨찾기할 회사의 ID',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: '회사 ID는 필수입니다.' })
  @IsInt({ message: '회사 ID는 정수여야 합니다.' })
  companyId: number;
}
