// /users/dto/verify.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @MinLength(6)
  password: string;
}
