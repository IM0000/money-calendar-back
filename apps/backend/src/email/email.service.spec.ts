import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { emailConfig } from '../config/email.config';
import * as nodemailer from 'nodemailer';
import { SendNotificationEmailDto } from '../notification/dto/notification.dto';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailConfig = {
    service: 'gmail',
    auth: {
      user: 'test@example.com',
      pass: 'password123',
    },
  };

  const mockTransporter = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // nodemailer 모킹 설정
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: emailConfig.KEY,
          useValue: mockEmailConfig,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMemberJoinVerification', () => {
    it('이메일 주소와 인증 코드로 회원 가입 인증 이메일을 보내야 합니다', async () => {
      const emailAddress = 'user@example.com';
      const code = '123456';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'mock-message-id',
        envelope: { from: 'test@example.com', to: [emailAddress] },
      });

      const result = await service.sendMemberJoinVerification(
        emailAddress,
        code,
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: emailAddress,
          subject: expect.any(String),
          html: expect.stringContaining(code),
        }),
      );

      expect(result).toEqual({
        messageId: 'mock-message-id',
        envelope: { from: 'test@example.com', to: [emailAddress] },
      });
    });

    it('인증 코드 이메일 본문에 코드와 유효 기간 정보가 포함되어야 합니다', async () => {
      const emailAddress = 'user@example.com';
      const code = '123456';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'mock-message-id',
      });

      await service.sendMemberJoinVerification(emailAddress, code);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(code),
        }),
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('10분'),
        }),
      );
    });
  });

  describe('sendNotificationEmail', () => {
    it('알림 이메일을 보내야 합니다', async () => {
      const notificationDto: SendNotificationEmailDto = {
        subject: '알림 제목',
        content: '알림 내용',
      };

      // 콘솔 로그 스파이 설정
      const consoleSpy = jest.spyOn(console, 'log');

      await service.sendNotificationEmail(notificationDto);

      // 현재 구현은 로그만 출력하는 임시 코드이므로, 콘솔 로그 호출 확인
      expect(consoleSpy).toHaveBeenCalledWith(
        '이메일 알림 발송:',
        notificationDto,
      );

      consoleSpy.mockRestore();
    });
  });
});
