import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigType } from '@nestjs/config';
import { emailConfig } from '../config/email.config';
import { awsConfig } from '../config/aws.config';
import { EmailProvider } from './email-provider.interface';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';

@Injectable()
export class SesProvider implements EmailProvider {
  private readonly logger = new Logger(SesProvider.name);
  private client: SESClient;
  private sender: string;

  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConfiguration: ConfigType<typeof emailConfig>,
    @Inject(awsConfig.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsConfig>,
  ) {
    this.client = new SESClient({
      region: this.awsConfiguration.region,
    });
    this.sender = this.emailConfiguration.from;
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const cmd = new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: {
          Body: { Html: { Data: html } },
          Subject: { Data: subject },
        },
        Source: this.sender,
      });

      const result = await this.client.send(cmd);
      this.logger.log(
        `Email sent successfully to ${to}, MessageId: ${result.MessageId}`,
      );
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // AWS SES 특정 에러 처리
      if (error.name === 'MessageRejected') {
        this.logger.error(`SES message rejected for ${to}: ${error.message}`);
        throw new BadRequestException({
          errorCode: ERROR_CODE_MAP.VALIDATION_002,
          errorMessage: '이메일 전송이 거부되었습니다',
        });
      }

      if (error.name === 'MailFromDomainNotVerifiedException') {
        this.logger.error(`SES domain not verified: ${error.message}`);
        throw new ServiceUnavailableException({
          errorCode: ERROR_CODE_MAP.SERVER_003,
          errorMessage: '이메일 서비스 설정 오류입니다',
        });
      }

      if (error.name === 'ConfigurationSetDoesNotExistException') {
        this.logger.error(`SES configuration error: ${error.message}`);
        throw new ServiceUnavailableException({
          errorCode: ERROR_CODE_MAP.SERVER_003,
          errorMessage: '이메일 서비스 설정 오류입니다',
        });
      }

      // 일반적인 AWS 에러 처리
      if (error.$metadata?.httpStatusCode) {
        const statusCode = error.$metadata.httpStatusCode;
        if (statusCode >= 400 && statusCode < 500) {
          this.logger.error(
            `SES client error (${statusCode}): ${error.message}`,
          );
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: '이메일 전송 요청이 잘못되었습니다',
          });
        }
        if (statusCode >= 500) {
          this.logger.error(
            `SES server error (${statusCode}): ${error.message}`,
          );
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
          });
        }
      }

      this.logger.error(
        `Failed to send email via SES: ${error.message}`,
        error.stack,
      );
      throw new ServiceUnavailableException({
        errorCode: ERROR_CODE_MAP.SERVER_003,
        errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
      });
    }
  }
}
