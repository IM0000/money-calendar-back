import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class OAuthConnectionDto {
  @IsString()
  provider: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class StatePayload {
  @IsString()
  oauthMethod: string;

  @IsNumber()
  userId: number;

  @IsString()
  provider: string;
}
