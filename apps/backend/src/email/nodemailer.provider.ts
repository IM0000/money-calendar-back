import { Injectable, Inject } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { emailConfig } from '../config/email.config';
import { EmailProvider } from './email-provider.interface';

@Injectable()
export class NodemailerProvider implements EmailProvider {
  private transporter: Mail;
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConfiguration: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.emailConfiguration.service,
      auth: {
        user: this.emailConfiguration.auth.user,
        pass: this.emailConfiguration.auth.pass,
      },
    });
  }

  sendMail(options: { to: string; subject: string; html: string }) {
    return this.transporter.sendMail(options);
  }
}
