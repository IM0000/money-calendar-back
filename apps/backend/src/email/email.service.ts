// /email/email.service.ts
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { emailConfig } from './../config/email.config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationEmailDto } from '../notification/dto/notification.dto';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Mail;
  constructor(
    @Inject(emailConfig.KEY)
    private emailConfiguration: ConfigType<typeof emailConfig>,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.emailConfiguration.service,
      auth: {
        user: this.emailConfiguration.auth.user,
        pass: this.emailConfiguration.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(emailAddress: string, code: string) {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '머니캘린더 가입 인증코드',
      html: `
        <p>머니캘린더 인증코드는 <strong>${code}</strong> 입니다.</p>
        <p>인증 코드의 유효 기간은 10분입니다.</p>
      `,
    };
    this.logger.log('sendMemberJoinVerification end');
    this.logger.log(mailOptions);
    return await this.transporter.sendMail(mailOptions);
  }

  async sendNotificationEmail(dto: SendNotificationEmailDto) {
    // TODO: 실제 이메일 발송 로직 구현
    // 현재는 로그만 출력
    console.log('이메일 알림 발송:', dto);
  }
}
