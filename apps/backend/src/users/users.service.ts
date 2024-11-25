import { LoginDto } from './../auth/dto/login.dto';
// users.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RandomNickList } from '../common/random-nick.constants';
import { EmailService } from '../email/email.service';
import { randomInt } from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // 이메일/비밀번호 기반 사용자 검증
  async validateUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    return await this.findUserByEmailAndPassword(email, password);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
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

  // 유저 비밀번호 업데이트
  async updateUserPassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // OAuth 사용자 생성 또는 검색
  async findOrCreateUserFromOAuth(oauthUser: any): Promise<User> {
    // OAuth 사용자가 이미 존재하면 반환, 없으면 새로 생성
    let user = await this.findUserByOAuthId(
      oauthUser.provider,
      oauthUser.providerId,
    );
    if (user) {
      return user;
    }

    // 2. 이메일로 기존 사용자 찾기
    user = await this.findUserByEmail(oauthUser.email);

    if (user) {
      // 3. 기존 사용자에 OAuth 계정 연동
      try {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            oauthAccounts: {
              create: {
                provider: oauthUser.provider,
                providerId: oauthUser.providerId,
              },
            },
          },
          include: {
            oauthAccounts: true, // 연동된 OAuth 정보 포함
          },
        });
        return user;
      } catch (error) {
        // 만약 이미 동일한 OAuth 계정이 존재한다면 예외 처리
        throw new ConflictException('이미 OAuth 계정이 연동되어 있습니다.');
      }
    }

    // 4. 새로운 사용자 생성
    user = await this.createUserFromOAuth(oauthUser);
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
    const nickname =
      RandomNickList[Math.floor(Math.random() * RandomNickList.length)];
    return await this.prisma.user.create({
      data: {
        email: oauthUser.email,
        nickname: nickname + new Date().getTime(),
        oauthAccounts: {
          create: [
            {
              provider: oauthUser.provider,
              providerId: oauthUser.providerId,
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

  /**
   * 기존 사용자 계정에 OAuth 계정 연동
   * @param userId 연동할 사용자 ID
   * @param oauthUser OAuth 사용자 정보
   * @returns 연동된 사용자 정보
   */
  async linkOAuthAccount(userId: number, oauthUser: any): Promise<User> {
    // 1. 해당 OAuth 계정이 이미 다른 사용자에 연동되어 있는지 확인
    const existingOAuthAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: oauthUser.provider,
          providerId: oauthUser.providerId,
        },
      },
    });

    if (existingOAuthAccount) {
      throw new ConflictException(
        `해당 OAuth 계정(${oauthUser.provider})은 이미 다른 사용자에 연동되어 있습니다.`,
      );
    }

    // 2. 사용자가 존재하는지 확인
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 3. OAuth 계정 연동
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        oauthAccounts: {
          create: {
            provider: oauthUser.provider,
            providerId: oauthUser.providerId,
          },
        },
      },
      include: {
        oauthAccounts: true, // 연동된 OAuth 정보 포함
      },
    });

    return updatedUser;
  }

  /**
   * 이메일로 사용자 생성
   * @param email 이메일 주소
   * @param password 비밀번호
   */
  async createUserByEmail(email: string, password: string): Promise<User> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nickname = `${
      RandomNickList[Math.floor(Math.random() * RandomNickList.length)]
    }${new Date().getTime()}`;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        verified: true, // 이메일 인증 완료 후 생성
      },
    });

    return user;
  }

  /**
   * 이메일로 인증 코드 발송
   * @param email 이메일 주소
   */
  async sendVerificationCode(email: string): Promise<void> {
    this.logger.log(email);
    // 인증 코드 생성
    const code = this.generateSixDigitCode(); // 숫자 6자리
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료

    // 기존 인증 코드 삭제
    await this.prisma.verificationCode.deleteMany({
      where: { email },
    });

    // 새 인증 코드 저장
    await this.prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // 이메일 전송
    await this.emailService.sendMemberJoinVerification(email, code);
    this.logger.log(email, code);
  }

  /**
   * 인증 코드 검증
   * @param email 이메일 주소
   * @param code 인증 코드
   */
  async verifyCode(email: string, code: string): Promise<void> {
    const verification = await this.prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!verification || verification.code !== code) {
      throw new BadRequestException('유효하지 않은 인증 코드입니다.');
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('인증 코드가 만료되었습니다.');
    }

    // 인증 완료 처리 (사용자 검증 상태 업데이트 등)
    const user = await this.findUserByEmail(email);
    if (user) {
      await this.prisma.user.update({
        where: { email },
        data: { verified: true },
      });
    }
  }

  /**
   * 이메일 토큰으로 이메일 찾기
   * @param token 이메일 토큰
   * @returns 이메일 주소
   */
  async findEmailFromVerificationToken(token: string): Promise<string> {
    const verification = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new BadRequestException('유효하지 않은 토큰입니다.');
    }

    return verification.email;
  }

  /**
   * 이메일 토큰 저장, 제한시간 10분
   * @param token 이메일 토큰
   * @param email 이메일
   */
  async storeVerificationToken(token: string, email: string): Promise<void> {
    this.logger.log(token, email);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료
    try {
      const result = await this.prisma.verificationToken.create({
        data: {
          token,
          email,
          expiresAt,
        },
      });

      this.logger.log(result);
    } catch (error) {
      this.logger.error('Error storing verification token:', error);
    }
  }

  /**
   * 6자리 숫자 인증 코드 생성
   */
  private generateSixDigitCode(): string {
    const min = 100000;
    const max = 999999;
    return randomInt(min, max + 1).toString();
  }
}
