import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '인증 코드', example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class LoginDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsNotEmpty()
  password: string;
}

export class OAuthConnectionDto {
  @ApiProperty({ description: 'OAuth 제공자', example: 'google' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'OAuth 액세스 토큰', required: false })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiProperty({ description: 'OAuth 리프레시 토큰', required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class StatePayload {
  @ApiProperty({ description: 'OAuth 인증 방식', example: 'connect' })
  @IsString()
  oauthMethod: string;

  @ApiProperty({ description: '사용자 ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'OAuth 제공자', example: 'google' })
  @IsString()
  provider: string;
}
