// users.service.ts

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // 이메일/비밀번호 기반 사용자 검증
  async validateUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    return await this.findUserByEmailAndPassword(email, password);
  }

  // 이메일과 비밀번호로 사용자 찾기
  async findUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // 비밀번호가 유효한 경우 사용자 반환 (비밀번호는 제외)
    const { password: _password, ...safeUser } = user;
    return safeUser as User;
  }

  // OAuth 사용자 생성 또는 검색
  async findOrCreateUserFromOAuth(oauthUser: any): Promise<User> {
    // OAuth 사용자가 이미 존재하면 반환, 없으면 새로 생성
    let user = await this.findUserByOAuthId(
      oauthUser.provider,
      oauthUser.providerId,
    );
    if (!user) {
      user = await this.createUserFromOAuth(oauthUser);
    }
    return user;
  }

  // OAuth 제공자와 제공자 ID로 사용자 찾기
  async findUserByOAuthId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        oauthAccounts: {
          some: {
            provider,
            providerId,
          },
        },
      },
      include: {
        oauthAccounts: true, // OAuth 정보도 함께 가져오기
      },
    });
  }

  // OAuth 사용자 생성
  async createUserFromOAuth(oauthUser: any): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: oauthUser.email,
        nickname: oauthUser.nickname,
        oauthAccounts: {
          create: [
            {
              provider: oauthUser.provider,
              providerId: oauthUser.providerId, // providerId로 수정
            },
          ],
        },
      },
      include: {
        oauthAccounts: true, // 생성된 OAuth 정보도 포함해서 반환
      },
    });
  }

  // ID로 사용자 찾기 (JWT 검증 시 사용)
  async findUserById(userId: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
