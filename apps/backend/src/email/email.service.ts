// /email/email.service.ts
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { emailConfig } from './../config/email.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
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

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.emailConfiguration.baseUrl;

    // 유저가 버튼 눌렀을 때 요청되는 url
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '머니캘린더 가입 인증 메일',
      html: `
        가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
