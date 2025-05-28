import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: '사용자 ID' })
  id: number;

  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '닉네임', nullable: true })
  nickname: string | null;

  @ApiProperty({ description: '이메일 인증 여부' })
  verified: boolean;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '업데이트 일시' })
  updatedAt: Date;
}
export class LoginDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
