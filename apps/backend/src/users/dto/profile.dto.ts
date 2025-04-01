import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  nickname?: string;
}

export class UpdateUserPasswordDto {
  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
    message:
      '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.',
  })
  currentPassword: string;

  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
    message:
      '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.',
  })
  newPassword: string;
}

export class OAuthConnectionDto {
  @IsString()
  provider: string;

  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
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
