// /email/email.service.ts
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { emailConfig } from './../config/email.config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

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
  ) {
    this.transporter = nodemailer.createTransport({
      service: emailConfiguration.service,
      auth: {
        user: emailConfiguration.auth.user,
        pass: emailConfiguration.auth.pass,
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
}
