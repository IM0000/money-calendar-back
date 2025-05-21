import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotificationService } from '../notification/notification.service';
import { jwtConfig } from '../config/jwt.config';
import { UpdatePasswordDto } from '../users/dto/profile.dto';
import {
  DeleteUserDto,
  UpdateProfileDto,
  UpdateUserPasswordDto,
  VerifyPasswordDto,
} from './dto/profile.dto';
import { UpdateUserNotificationSettingsDto } from '../notification/dto/notification.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let notificationService: NotificationService;

  const mockUsersService = {
    updateUserPassword: jest.fn(),
    findUserByEmail: jest.fn(),
    getUserProfile: jest.fn(),
    updateUserProfile: jest.fn(),
    changeUserPassword: jest.fn(),
    deleteUser: jest.fn(),
    disconnectOAuthAccount: jest.fn(),
    verifyUserPassword: jest.fn(),
  };

  const mockNotificationService = {
    getUserNotifications: jest.fn(),
    getUnreadNotificationsCount: jest.fn(),
    getUserNotificationSettings: jest.fn(),
    updateUserNotificationSettings: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'test-secret',
    expiration: '1d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    notificationService = module.get<NotificationService>(NotificationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updatePassword', () => {
    it('should update password and return success message', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        email: 'test@example.com',
        password: 'newPassword123',
      };

      mockUsersService.updateUserPassword.mockResolvedValue(undefined);

      const result = await controller.updatePassword(updatePasswordDto);

      expect(usersService.updateUserPassword).toHaveBeenCalledWith(
        updatePasswordDto.email,
        updatePasswordDto.password,
      );
      expect(result).toEqual({ message: 'success' });
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 1,
        email,
        nickname: 'tester',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

      const result = await controller.getUserByEmail(email);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const mockProfile = {
        id: 1,
        email: 'test@example.com',
        nickname: 'tester',
        oauthAccounts: [{ provider: 'google', providerId: '123456' }],
      };

      mockUsersService.getUserProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(req as any);

      expect(usersService.getUserProfile).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const updateProfileDto: UpdateProfileDto = {
        nickname: 'newNickname',
      };

      const mockUpdatedProfile = {
        id: 1,
        email: 'test@example.com',
        nickname: 'newNickname',
      };

      mockUsersService.updateUserProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(
        req as any,
        updateProfileDto,
      );

      expect(usersService.updateUserProfile).toHaveBeenCalledWith(
        req.user.id,
        updateProfileDto,
      );
      expect(result).toEqual(mockUpdatedProfile);
    });
  });

  describe('changeUserPassword', () => {
    it('should change user password', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const updatePasswordDto: UpdateUserPasswordDto = {
        email: 'test@email.com',
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
      };

      const mockResult = { message: '비밀번호가 성공적으로 변경되었습니다.' };

      mockUsersService.changeUserPassword.mockResolvedValue(mockResult);

      const result = await controller.changeUserPassword(
        req as any,
        updatePasswordDto,
      );

      expect(usersService.changeUserPassword).toHaveBeenCalledWith(
        req.user.id,
        updatePasswordDto.currentPassword,
        updatePasswordDto.newPassword,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteUser', () => {
    it('should delete user account', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const deleteUserDto: DeleteUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = { message: '계정이 성공적으로 삭제되었습니다.' };

      mockUsersService.deleteUser.mockResolvedValue(mockResult);

      const result = await controller.deleteUser(req as any, deleteUserDto);

      expect(usersService.deleteUser).toHaveBeenCalledWith(
        req.user.id,
        deleteUserDto.email,
        deleteUserDto.password,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('disconnectOAuthAccount', () => {
    it('should disconnect OAuth account', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const provider = 'google';

      mockUsersService.disconnectOAuthAccount.mockResolvedValue({
        message: 'OAuth 계정 연결이 해제되었습니다.',
      });

      const result = await controller.disconnectOAuthAccount(
        req as any,
        provider,
      );

      expect(usersService.disconnectOAuthAccount).toHaveBeenCalledWith(
        req.user.id,
        provider,
      );
      expect(result).toEqual({ message: 'OAuth 계정 연결이 해제되었습니다.' });
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications with pagination', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const page = '2';
      const limit = '10';

      const mockNotifications = {
        notifications: [
          { id: 1, userId: 1, contentType: 'EARNINGS', contentId: 1 },
        ],
        total: 15,
      };

      mockNotificationService.getUserNotifications.mockResolvedValue(
        mockNotifications,
      );

      const result = await controller.getUserNotifications(
        req as any,
        page,
        limit,
      );

      expect(notificationService.getUserNotifications).toHaveBeenCalledWith(
        req.user.id,
        parseInt(page),
        parseInt(limit),
      );
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('getUnreadNotificationsCount', () => {
    it('should get unread notifications count', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const mockCount = { count: 5 };

      mockNotificationService.getUnreadNotificationsCount.mockResolvedValue(
        mockCount,
      );

      const result = await controller.getUnreadNotificationsCount(req as any);

      expect(
        notificationService.getUnreadNotificationsCount,
      ).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(mockCount);
    });
  });

  describe('getNotificationSettings', () => {
    it('should get user notification settings', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const mockSettings = {
        emailEnabled: true,
        pushEnabled: false,
        preferredMethod: 'EMAIL',
      };

      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        mockSettings,
      );

      const result = await controller.getNotificationSettings(req as any);

      expect(
        notificationService.getUserNotificationSettings,
      ).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(mockSettings);
    });
  });

  describe('updateNotificationSettings', () => {
    it('should update user notification settings', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const updateSettingsDto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        pushEnabled: true,
        preferredMethod: 'PUSH',
      };

      const mockUpdatedSettings = {
        userId: 1,
        ...updateSettingsDto,
      };

      mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
        mockUpdatedSettings,
      );

      const result = await controller.updateNotificationSettings(
        req as any,
        updateSettingsDto,
      );

      expect(
        notificationService.updateUserNotificationSettings,
      ).toHaveBeenCalledWith(req.user.id, updateSettingsDto);
      expect(result).toEqual(mockUpdatedSettings);
    });
  });

  describe('verifyPassword', () => {
    it('should verify user password and return result', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const verifyPasswordDto: VerifyPasswordDto = {
        password: 'password123',
      };

      mockUsersService.verifyUserPassword.mockResolvedValue(true);

      const result = await controller.verifyPassword(
        req as any,
        verifyPasswordDto,
      );

      expect(usersService.verifyUserPassword).toHaveBeenCalledWith(
        req.user.id,
        verifyPasswordDto.password,
      );
      expect(result).toEqual({ isValid: true });
    });

    it('should return false if password is invalid', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const verifyPasswordDto: VerifyPasswordDto = {
        password: 'wrongPassword',
      };

      mockUsersService.verifyUserPassword.mockResolvedValue(false);

      const result = await controller.verifyPassword(
        req as any,
        verifyPasswordDto,
      );

      expect(usersService.verifyUserPassword).toHaveBeenCalledWith(
        req.user.id,
        verifyPasswordDto.password,
      );
      expect(result).toEqual({ isValid: false });
    });
  });
});
