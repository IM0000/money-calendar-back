import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let emailService: EmailService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    oAuthAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    verificationToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    verificationCode: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findUserByEmail('nonexistent@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findUserById(999);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('findUserByOAuthId', () => {
    it('should return a user if found by OAuth credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        oauthAccounts: [
          {
            provider: 'google',
            providerId: '123456',
          },
        ],
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findUserByOAuthId('google', '123456');

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          oauthAccounts: {
            some: {
              provider: 'google',
              providerId: '123456',
            },
          },
        },
        include: {
          oauthAccounts: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findEmailFromVerificationToken', () => {
    it('should return email from a valid token', async () => {
      const token = 'valid-token';
      const email = 'test@example.com';
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1); // 1 hour in the future

      mockPrismaService.verificationToken.findUnique.mockResolvedValue({
        token,
        email,
        expiresAt: futureDate,
      });

      const result = await service.findEmailFromVerificationToken(token);

      expect(prismaService.verificationToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toEqual(email);
    });

    it('should throw BadRequestException if token is expired', async () => {
      const token = 'expired-token';
      const email = 'test@example.com';
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1); // 1 hour in the past

      mockPrismaService.verificationToken.findUnique.mockResolvedValue({
        token,
        email,
        expiresAt: pastDate,
      });

      await expect(
        service.findEmailFromVerificationToken(token),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if token not found', async () => {
      const token = 'nonexistent-token';

      mockPrismaService.verificationToken.findUnique.mockResolvedValue(null);

      await expect(
        service.findEmailFromVerificationToken(token),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createUserFromOAuth', () => {
    it('should create a new user from OAuth credentials', async () => {
      const oauthUser = {
        email: 'oauth@example.com',
        provider: 'google',
        providerId: '123456',
      };

      const createdUser = {
        id: 1,
        email: oauthUser.email,
        nickname: expect.any(String),
        verified: true,
        oauthAccounts: [
          {
            provider: oauthUser.provider,
            providerId: oauthUser.providerId,
          },
        ],
      };

      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.createUserFromOAuth(oauthUser);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: oauthUser.email,
          nickname: expect.any(String),
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
        include: {
          oauthAccounts: true,
        },
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('updateUserPassword', () => {
    it('should update user password', async () => {
      const email = 'test@example.com';
      const newPassword = 'new-password';
      const hashedPassword = 'hashed-new-password';

      const mockUser = {
        id: 1,
        email,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.update.mockResolvedValue(null);

      await service.updateUserPassword(email, newPassword);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { email },
        data: { password: hashedPassword },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const email = 'nonexistent@example.com';
      const newPassword = 'new-password';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserPassword(email, newPassword),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('linkOAuthAccount', () => {
    it('should link OAuth account to user', async () => {
      const userId = 1;
      const oauthUser = {
        provider: 'google',
        providerId: '123456',
        email: 'oauth@example.com',
      };

      const mockUser = {
        id: userId,
        email: 'test@example.com',
      };

      const updatedUser = {
        ...mockUser,
        oauthAccounts: [
          {
            provider: oauthUser.provider,
            providerId: oauthUser.providerId,
            oauthEmail: oauthUser.email,
          },
        ],
      };

      mockPrismaService.oAuthAccount.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.linkOAuthAccount(userId, oauthUser);

      expect(prismaService.oAuthAccount.findUnique).toHaveBeenCalledWith({
        where: {
          provider_providerId: {
            provider: oauthUser.provider,
            providerId: oauthUser.providerId,
          },
        },
      });

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          oauthAccounts: {
            create: {
              provider: 'google',
              providerId: '123456',
              oauthEmail: 'oauth@example.com',
            },
          },
          verified: true,
        },
        include: {
          oauthAccounts: true,
        },
      });

      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException if OAuth account already linked to another user', async () => {
      const userId = 1;
      const oauthUser = {
        provider: 'google',
        providerId: '123456',
        email: 'oauth@example.com',
      };

      mockPrismaService.oAuthAccount.findUnique.mockResolvedValue({
        id: 1,
        userId: 2, // Different user
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
      });

      await expect(service.linkOAuthAccount(userId, oauthUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      const oauthUser = {
        provider: 'google',
        providerId: '123456',
        email: 'oauth@example.com',
      };

      mockPrismaService.oAuthAccount.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.linkOAuthAccount(userId, oauthUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
