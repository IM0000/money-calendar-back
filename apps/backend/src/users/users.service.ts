import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RandomNickList } from '../common/random-nick.constants';
import { EmailService } from '../email/email.service';
import { UserDto } from '../auth/dto/users.dto';
import { ErrorCodes } from '../common/enums/error-codes.enum';
import { generateSixDigitCode } from '../utils/code-generator';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(userId: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findUserByOAuthId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        oauthAccounts: {
          some: { provider, providerId },
        },
      },
      include: { oauthAccounts: true },
    });
  }

  async findEmailFromVerificationToken(token: string): Promise<string> {
    const verification = await this.prisma.verificationToken.findUnique({
      where: { token },
    });
    if (!verification || verification.expiresAt < new Date()) {
      throw new BadRequestException({
        errorCode: ErrorCodes.AUTH_002,
        errorMessage: '유효하지 않은 토큰입니다.',
      });
    }
    return verification.email;
  }

  async createUserFromOAuth(oauthUser: any): Promise<User> {
    const nickname =
      RandomNickList[Math.floor(Math.random() * RandomNickList.length)];
    return await this.prisma.user.create({
      data: {
        email: oauthUser.email,
        nickname: nickname + Date.now(),
        verified: true,
        oauthAccounts: {
          create: [
            {
              provider: oauthUser.provider,
              providerId: oauthUser.providerId,
            },
          ],
        },
      },
      include: { oauthAccounts: true },
    });
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '해당 이메일의 사용자를 찾을 수 없습니다.',
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashed },
    });
  }

  async linkOAuthAccount(userId: number, oauthUser: any): Promise<User> {
    const existing = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: oauthUser.provider,
          providerId: oauthUser.providerId,
        },
      },
    });
    if (existing) {
      throw new ConflictException({
        errorCode: ErrorCodes.CONFLICT_001,
        errorMessage: `해당 OAuth 계정(${oauthUser.provider})은 이미 다른 사용자에 연동되어 있습니다.`,
      });
    }
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '사용자를 찾을 수 없습니다.',
      });
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        verified: true,
        oauthAccounts: {
          create: {
            provider: oauthUser.provider,
            providerId: oauthUser.providerId,
            oauthEmail: oauthUser.email,
          },
        },
      },
      include: { oauthAccounts: true },
    });
  }

  async createUserByEmail(email: string, password?: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new ConflictException({
        errorCode: ErrorCodes.CONFLICT_001,
        errorMessage: '이미 사용 중인 이메일입니다.',
        data: existing,
      });
    }
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const nickname = `${
      RandomNickList[Math.floor(Math.random() * RandomNickList.length)]
    }${Date.now()}`;
    return await this.prisma.user.create({
      data: { email, password: hashed, nickname, verified: true },
    });
  }

  async sendVerificationCode(email: string): Promise<void> {
    const code = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.$transaction(async (tx) => {
      await tx.verificationCode.deleteMany({ where: { email } });
      await tx.verificationCode.create({ data: { email, code, expiresAt } });
      const existing = await tx.user.findUnique({ where: { email } });
      if (!existing) {
        await tx.user.create({ data: { email, verified: false } });
      }
    });
    await this.emailService.sendMemberJoinVerification(email, code);
  }

  async verifyEmailCode(email: string, code: string): Promise<UserDto> {
    return await this.prisma.$transaction(async (tx) => {
      const verification = await tx.verificationCode.findUnique({
        where: { email },
      });
      if (!verification || verification.code !== code) {
        throw new BadRequestException({
          errorCode: ErrorCodes.AUTH_002,
          errorMessage: '유효하지 않은 인증 코드입니다.',
        });
      }
      if (verification.expiresAt < new Date()) {
        throw new BadRequestException({
          errorCode: ErrorCodes.AUTH_001,
          errorMessage: '인증 코드가 만료되었습니다.',
        });
      }
      const user = await this.createUserByEmail(email);
      if (user) {
        await tx.user.update({ where: { email }, data: { verified: true } });
      }
      return user;
    });
  }

  async storeVerificationToken(token: string, email: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.prisma.verificationToken.create({
      data: { token, email, expiresAt },
    });
  }

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { oauthAccounts: true },
    });
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '사용자를 찾을 수 없습니다.',
      });
    }
    const providers = ['google', 'kakao', 'apple', 'discord'];
    const oauthConnections = providers.map((provider) => {
      const account = user.oauthAccounts.find(
        (a) => a.provider.toLowerCase() === provider,
      );
      return {
        provider,
        connected: !!account,
        oauthEmail: account?.oauthEmail,
      };
    });
    return {
      id: user.id,
      email: user.email,
      hasPassword: user.password !== null,
      nickname: user.nickname,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      oauthConnections,
    };
  }

  async updateUserProfile(userId: number, updateDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '사용자를 찾을 수 없습니다.',
      });
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { ...updateDto },
    });
    return {
      id: updated.id,
      email: updated.email,
      nickname: updated.nickname,
      verified: updated.verified,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async changeUserPassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '사용자를 찾을 수 없습니다.',
      });
    }
    if (
      currentPassword &&
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      throw new BadRequestException({
        errorCode: ErrorCodes.VALIDATION_002,
        errorMessage: '현재 비밀번호가 일치하지 않습니다.',
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  async verifyUserPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '사용자를 찾을 수 없습니다.',
      });
    }
    if (!user.password) {
      throw new BadRequestException({
        errorCode: ErrorCodes.ACCOUNT_001,
        errorMessage: '비밀번호가 설정되어 있지 않은 계정입니다.',
      });
    }
    return await bcrypt.compare(password, user.password);
  }

  async disconnectOAuthAccount(userId: number, provider: string) {
    const connected = await this.prisma.oAuthAccount.findMany({
      where: { userId },
    });
    if (connected.length <= 1) {
      throw new ForbiddenException({
        errorCode: ErrorCodes.RESOURCE_003,
        errorMessage:
          '최소 하나의 로그인 방법이 필요합니다. 소셜 계정 연결을 해제할 수 없습니다.',
      });
    }
    await this.prisma.oAuthAccount.deleteMany({ where: { userId, provider } });
    return { message: `${provider} 계정 연결이 해제되었습니다.` };
  }

  async deleteUser(
    userId: number,
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { oauthAccounts: true },
    });
    if (!user) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_001,
        errorMessage: '사용자를 찾을 수 없습니다.',
      });
    }

    if (user.email !== email) {
      throw new BadRequestException({
        errorCode: ErrorCodes.VALIDATION_002,
        errorMessage: '이메일이 일치하지 않습니다.',
      });
    }

    if (!user.password) {
      throw new BadRequestException({
        errorCode: ErrorCodes.ACCOUNT_001,
        errorMessage: '비밀번호가 설정되어 있지 않은 계정입니다.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException({
        errorCode: ErrorCodes.VALIDATION_002,
        errorMessage: '비밀번호가 일치하지 않습니다.',
      });
    }

    return { message: '계정이 성공적으로 삭제되었습니다.' };
  }
}
