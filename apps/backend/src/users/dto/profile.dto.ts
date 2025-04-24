import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(2, 20)
  nickname: string;
}

export class UpdateUserPasswordDto {
  @ValidateIf((o) => o.currentPassword !== '')
  @IsString()
  @Length(8, 100)
  currentPassword?: string;

  @IsString()
  @Length(8, 100)
  newPassword: string;

  @IsEmail()
  email: string;
}
export class ProfileResponseDto {
  id: number;
  email: string;
  nickname: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  oauthConnections: {
    provider: string;
    connected: boolean;
  }[];
}

export class DeleteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
export class VerifyPasswordDto {
  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;
}
