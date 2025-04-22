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

  it('transporter.sendMail 을 호출해야 합니다', async () => {
    const dto = { email: 'a@b.com', subject: '제목', content: '내용' };
    // sendMail 이 Promise 를 반환하도록 세팅
    mockTransporter.sendMail.mockResolvedValue({ messageId: 'id123' });

    await service.sendNotificationEmail(dto);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: dto.email,
        subject: dto.subject,
        html: expect.stringContaining(dto.content),
      }),
    );
  });
});
