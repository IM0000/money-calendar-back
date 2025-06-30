import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { jwtConfig } from '../config/jwt.config';
import { UpdatePasswordDto } from './dto/profile.dto';
import {
  DeleteUserDto,
  UpdateProfileDto,
  UpdateUserPasswordDto,
  VerifyPasswordDto,
} from './dto/profile.dto';

describe('UserController', () => {
  let controller: UserController;
  let usersService: UserService;

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

  const mockJwtConfig = {
    secret: 'test-secret',
    expiration: '1d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUsersService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    usersService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('정의되어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  describe('updatePassword', () => {
    it('비밀번호를 업데이트하고 성공 메시지를 반환해야 합니다', async () => {
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

  describe('getProfile', () => {
    it('사용자 프로필을 반환해야 합니다', async () => {
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
    it('사용자 프로필을 업데이트해야 합니다', async () => {
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
    it('사용자 비밀번호를 변경해야 합니다', async () => {
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
    it('사용자 계정을 삭제해야 합니다', async () => {
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
    it('OAuth 계정 연결을 해제해야 합니다', async () => {
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

  describe('verifyPassword', () => {
    it('사용자 비밀번호를 검증하고 결과를 반환해야 합니다', async () => {
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

    it('비밀번호가 유효하지 않으면 false를 반환해야 합니다', async () => {
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
