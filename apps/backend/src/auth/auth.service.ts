// /auth/auth.service.ts
import * as jwt from 'jsonwebtoken';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { User } from '@prisma/client';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService, // Users 관련 로직
  ) {}

  /**
   * 이메일과 비밀번호로 로그인 처리
   * @param loginDto 로그인 정보
   * @returns JWT 토큰과 사용자 정보
   */
  async loginWithEmail(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.validateUserByEmailAndPassword(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new Error('잘못된 이메일 또는 비밀번호입니다.');
    }
    const token = this.generateJwtToken(user);
    return { token, user };
  }

  /**
   * OAuth 제공자를 통해 로그인 처리
   * @param oauthUser OAuth 사용자 정보
   * @returns JWT 토큰과 사용자 정보
   */
  async loginWithOAuth(oauthUser: any): Promise<any> {
    // UsersService를 통해 사용자 찾기 또는 생성
    const user = await this.usersService.findOrCreateUserFromOAuth(oauthUser);

    // JWT 토큰 생성
    const token = this.generateJwtToken(user);

    return { token, user };
  }

  /**
   * JWT 토큰 생성
   * @param user 사용자 정보
   * @returns JWT 토큰
   */
  private generateJwtToken(user: User): string {
    const payload = {
      sub: user.id, // 토큰의 subject (주체)로 사용자 ID 설정
      email: user.email,
      nickname: user.nickname,
    };

    const secret = this.jwtConfiguration.secret;
    const expiresIn = this.jwtConfiguration.expiration;

    // JWT 생성
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * 이메일 인증 토큰 생성 및 저장
   * @param email 사용자 이메일
   * @returns opaque 토큰
   */
  async generateVerificationToken(email: string): Promise<string> {
    const token = uuidv4(); // 고유한 토큰 생성

    // 토큰을 데이터베이스에 저장 (예: Prisma 사용)
    await this.usersService.storeVerificationToken(token, email);

    return token;
  }

  /**
   * 토큰 검증 및 이메일 반환
   * @param token opaque 토큰
   * @returns 사용자 이메일
   */
  async verifyVerificationToken(token: string): Promise<string> {
    const email = await this.usersService.findEmailFromVerificationToken(token);

    return email;
  }

  /**
   * 기존 사용자 계정에 OAuth 계정 연동
   * @param userId 현재 로그인한 사용자 ID
   * @param provider OAuth 제공자 이름
   * @param query OAuth 제공자로부터 받은 쿼리 파라미터
   * @returns 연동된 사용자 정보
   */
  // async linkOAuthAccount(
  //   userId: number,
  //   provider: string,
  //   query: any,
  // ): Promise<User> {
  //   const strategy = this.strategies.find(
  //     (strategy) => strategy.provider === provider,
  //   );
  //   if (!strategy) {
  //     throw new Error(`'${provider}'는 지원하지 않는 인증 기관입니다.`);
  //   }
  //   const oauthUser = await strategy.authenticate(query);
  //   const updatedUser = await this.usersService.linkOAuthAccount(
  //     userId,
  //     oauthUser,
  //   );
  //   return updatedUser;
  // }
}
