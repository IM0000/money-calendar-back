import {
  Injectable,
  Inject,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { emailConfig } from '../config/email.config';
import { EmailProvider } from './email-provider.interface';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';

@Injectable()
export class NodemailerProvider implements EmailProvider {
  private readonly logger = new Logger(NodemailerProvider.name);
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

  async sendMail(options: { to: string; subject: string; html: string }) {
    try {
      const result = await this.transporter.sendMail({
        from: this.emailConfiguration.from,
        ...options,
      });

      this.logger.log(
        `Email sent successfully to ${options.to}, MessageId: ${result.messageId}`,
      );
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'EAUTH') {
        this.logger.error(`Email authentication failed: ${error.message}`);
        throw new ServiceUnavailableException({
          errorCode: ERROR_CODE_MAP.SERVER_003,
          errorMessage: '이메일 서비스 인증 오류입니다',
        });
      }

      if (error.code === 'ECONNECTION') {
        this.logger.error(`Email connection failed: ${error.message}`);
        throw new ServiceUnavailableException({
          errorCode: ERROR_CODE_MAP.SERVER_003,
          errorMessage: '이메일 서버 연결 오류입니다',
        });
      }

      if (error.code === 'EMESSAGE') {
        this.logger.error(`Email message error: ${error.message}`);
        throw new BadRequestException({
          errorCode: ERROR_CODE_MAP.VALIDATION_002,
          errorMessage: '이메일 메시지 형식이 잘못되었습니다',
        });
      }

      if (error.responseCode) {
        const statusCode = error.responseCode;
        if (statusCode >= 400 && statusCode < 500) {
          this.logger.error(
            `Email client error (${statusCode}): ${error.message}`,
          );
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: '이메일 전송 요청이 잘못되었습니다',
          });
        }
        if (statusCode >= 500) {
          this.logger.error(
            `Email server error (${statusCode}): ${error.message}`,
          );
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
          });
        }
      }

      this.logger.error(
        `Failed to send email via Nodemailer: ${error.message}`,
        error.stack,
      );
      throw new ServiceUnavailableException({
        errorCode: ERROR_CODE_MAP.SERVER_003,
        errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
      });
    }
  }
}
