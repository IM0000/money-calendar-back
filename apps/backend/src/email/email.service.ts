import { frontendConfig } from './../config/frontend.config';
// /email/email.service.ts
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { emailConfig } from './../config/email.config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationEmailDto } from '../notification/dto/notification.dto';
import { EmailProvider } from './email-provider.interface';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    @Inject('EmailProvider') private readonly provider: EmailProvider,
    @Inject(frontendConfig.KEY)
    private readonly frontendConfiguration: ConfigType<typeof frontendConfig>,
  ) {}

  async sendMemberJoinVerification(emailAddress: string, code: string) {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '머니캘린더 가입 인증코드',
      html: `
        <p>머니캘린더 인증코드는 <strong>${code}</strong> 입니다.</p>
        <p>인증 코드의 유효 기간은 10분입니다.</p>
      `,
    };
    return await this.provider.sendMail(mailOptions);
  }

  async sendNotificationEmail(dto: SendNotificationEmailDto) {
    const mailOptions: EmailOptions = {
      to: dto.email,
      subject: dto.subject,
      html: dto.content,
    };
    return await this.provider.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    email: string,
    passwordResetToken: string,
  ): Promise<void> {
    const resetUrl = `${this.frontendConfiguration.baseUrl}/users/password?token=${passwordResetToken}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: '머니캘린더 비밀번호 재설정 안내',
      html: `<p>아래 링크를 클릭하여 비밀번호를 재설정해주세요.<br/><a href="${resetUrl}">${resetUrl}</a></p>`,
    };
    return await this.provider.sendMail(mailOptions);
  }
}
