import { Injectable } from '@nestjs/common';
import { User, OAuthAccount } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';

export interface CreateUserData {
  email: string;
  password?: string | null;
  nickname: string;
  verified: boolean;
}

export interface UserWithOAuth extends User {
  oauthAccounts: OAuthAccount[];
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByIdWithOAuth(id: number): Promise<UserWithOAuth | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { oauthAccounts: true },
    });
  }

  async findByOAuthId(
    provider: string,
    providerId: string,
  ): Promise<UserWithOAuth | null> {
    return await this.prisma.user.findFirst({
      where: {
        oauthAccounts: {
          some: { provider, providerId },
        },
      },
      include: { oauthAccounts: true },
    });
  }

  async create(userData: CreateUserData): Promise<User> {
    return await this.prisma.user.create({ data: userData });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updatePasswordByEmail(
    email: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  async updateProfile(
    userId: number,
    profileData: UpdateProfileDto,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: profileData,
    });
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async findOAuthAccountsByUserId(userId: number): Promise<OAuthAccount[]> {
    return await this.prisma.oAuthAccount.findMany({
      where: { userId },
    });
  }

  async deleteOAuthAccounts(userId: number, provider: string): Promise<void> {
    await this.prisma.oAuthAccount.deleteMany({
      where: { userId, provider },
    });
  }
}
