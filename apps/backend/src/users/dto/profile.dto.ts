import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ description: '유저 닉네임', example: '홍길동' })
  @IsString()
  @Length(2, 20)
  nickname: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: '현재 비밀번호', required: false })
  @ValidateIf((o) => o.currentPassword !== '')
  @IsString()
  @Length(8, 100)
  currentPassword?: string;

  @ApiProperty({ description: '새 비밀번호', example: 'newPassword123' })
  @IsString()
  @Length(8, 100)
  newPassword: string;

  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  email: string;
}
export class ProfileResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: number;

  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '사용자 닉네임', nullable: true })
  nickname: string | null;

  @ApiProperty({ description: '이메일 인증 여부' })
  verified: boolean;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '업데이트 일시' })
  updatedAt: Date;

  @ApiProperty({ description: 'OAuth 연결 정보' })
  oauthConnections: {
    provider: string;
    connected: boolean;
  }[];
}

export class DeleteUserDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  @IsString()
  password: string;
}
export class VerifyPasswordDto {
  @ApiProperty({ description: '확인할 비밀번호' })
  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '새 비밀번호', example: 'newPassword123' })
  @IsString()
  password: string;
}
