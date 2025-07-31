import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, VerificationCode, OAuthAccount } from '@prisma/client';

export interface CreateUserWithOAuthData {
  email: string;
  nickname: string;
  verified: boolean;
  oauthAccount: {
    provider: string;
    providerId: string;
    oauthEmail?: string;
  };
}

export interface OAuthAccountData {
  provider: string;
  providerId: string;
  oauthEmail?: string;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // VerificationToken 관련 메서드
  async storeVerificationToken(token: string, email: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료
    await this.prisma.verificationToken.create({
      data: { token, email, expiresAt },
    });
  }

  async findEmailFromVerificationToken(token: string): Promise<string | null> {
    const verification = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      return null;
    }

    return verification.email;
  }

  // VerificationCode 관련 메서드
  async storeVerificationCode(email: string, code: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료
    await this.prisma.$transaction(async (tx) => {
      await tx.verificationCode.deleteMany({ where: { email } });
      await tx.verificationCode.create({ data: { email, code, expiresAt } });
    });
  }

  async findVerificationCode(email: string): Promise<VerificationCode | null> {
    return await this.prisma.verificationCode.findUnique({
      where: { email },
    });
  }

  async deleteVerificationCode(email: string): Promise<void> {
    await this.prisma.verificationCode.deleteMany({ where: { email } });
  }

  // OAuth 관련 메서드
  async createUserWithOAuth(userData: CreateUserWithOAuthData): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: userData.email,
        nickname: userData.nickname,
        verified: userData.verified,
        oauthAccounts: {
          create: [userData.oauthAccount],
        },
      },
      include: { oauthAccounts: true },
    });
  }

  async findOAuthAccount(
    provider: string,
    providerId: string,
  ): Promise<OAuthAccount | null> {
    return await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  async linkOAuthAccount(
    userId: number,
    oauthData: OAuthAccountData,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        verified: true,
        oauthAccounts: {
          create: {
            provider: oauthData.provider,
            providerId: oauthData.providerId,
            oauthEmail: oauthData.oauthEmail,
          },
        },
      },
      include: { oauthAccounts: true },
    });
  }

  // User 관련 메서드 (AuthService에서 직접 사용하는 것들)
  async setRefreshTokenHash(userId: number, hash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken: hash },
    });
  }

  async removeRefreshTokenHash(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken: null },
    });
  }

  async findUserWithRefreshToken(
    userId: number,
  ): Promise<{ currentHashedRefreshToken: string | null } | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentHashedRefreshToken: true },
    });
  }

  // 이메일 인증 과정에서 사용자 생성/업데이트
  async createUnverifiedUser(email: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await this.prisma.user.create({
        data: {
          email,
          verified: false,
        },
      });
    }
  }

  async markUserAsVerified(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { verified: true },
    });
  }

  // 트랜잭션을 사용하는 복잡한 작업들
  async verifyEmailCodeTransaction(
    email: string,
    code: string,
  ): Promise<{
    isValid: boolean;
    verification?: VerificationCode;
  }> {
    return await this.prisma.$transaction(async (tx) => {
      const verification = await tx.verificationCode.findUnique({
        where: { email },
      });

      if (
        !verification ||
        verification.code !== code ||
        verification.expiresAt < new Date()
      ) {
        return { isValid: false };
      }

      return { isValid: true, verification };
    });
  }

  async sendVerificationCodeTransaction(
    email: string,
    code: string,
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.$transaction(async (tx) => {
      await tx.verificationCode.deleteMany({ where: { email } });
      await tx.verificationCode.create({ data: { email, code, expiresAt } });
      const existing = await tx.user.findUnique({ where: { email } });
      if (!existing) {
        await tx.user.create({ data: { email, verified: false } });
      }
    });
  }
}
