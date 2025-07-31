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
import { UpdateProfileDto } from './dto/profile.dto';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findUserById(userId: number): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  async findUserByOAuthId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return await this.userRepository.findByOAuthId(provider, providerId);
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePasswordByEmail(email, hashed);
  }

  async createUserByEmail(email: string, password?: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new ConflictException({
        errorCode: ERROR_CODE_MAP.CONFLICT_001,
        errorMessage: ERROR_MESSAGE_MAP.CONFLICT_001,
        data: existing,
      });
    }
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const nickname = `${
      RandomNickList[Math.floor(Math.random() * RandomNickList.length)]
    }${Date.now()}`;
    const user = await this.userRepository.create({
      email,
      password: hashed,
      nickname,
      verified: true,
    });
    const { password: _, ...safeUser } = user;
    return safeUser as User;
  }

  async getUserProfile(userId: number) {
    const user = await this.userRepository.findByIdWithOAuth(userId);
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
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
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    const updated = await this.userRepository.updateProfile(userId, updateDto);
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
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    if (
      currentPassword &&
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.VALIDATION_002,
        errorMessage: ERROR_MESSAGE_MAP.VALIDATION_002,
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashed);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  async verifyUserPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }
    if (!user.password) {
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.ACCOUNT_001,
        errorMessage: ERROR_MESSAGE_MAP.ACCOUNT_001,
      });
    }
    return await bcrypt.compare(password, user.password);
  }

  async disconnectOAuthAccount(userId: number, provider: string) {
    const connected = await this.userRepository.findOAuthAccountsByUserId(
      userId,
    );
    if (connected.length <= 1) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE_MAP.RESOURCE_003,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_003,
      });
    }
    await this.userRepository.deleteOAuthAccounts(userId, provider);
    return { message: `${provider} 계정 연결이 해제되었습니다.` };
  }

  async deleteUser(
    userId: number,
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findByIdWithOAuth(userId);
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODE_MAP.RESOURCE_001,
        errorMessage: ERROR_MESSAGE_MAP.RESOURCE_001,
      });
    }

    if (user.email !== email) {
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.VALIDATION_002,
        errorMessage: ERROR_MESSAGE_MAP.VALIDATION_002,
      });
    }

    if (!user.password) {
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.ACCOUNT_001,
        errorMessage: ERROR_MESSAGE_MAP.ACCOUNT_001,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.VALIDATION_002,
        errorMessage: ERROR_MESSAGE_MAP.VALIDATION_002,
      });
    }

    await this.userRepository.delete(userId);

    return { message: '계정이 성공적으로 삭제되었습니다.' };
  }
}
