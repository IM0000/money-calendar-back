import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  id: number;
  email: string;
  password: string | null;
  nickname: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
