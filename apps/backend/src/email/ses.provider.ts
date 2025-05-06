import { Inject, Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigType } from '@nestjs/config';
import { emailConfig } from '../config/email.config';
import { awsConfig } from '../config/aws.config';
import { EmailProvider } from './email-provider.interface';

@Injectable()
export class SesProvider implements EmailProvider {
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
    const cmd = new SendEmailCommand({
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Data: html } },
        Subject: { Data: subject },
      },
      Source: this.sender,
    });
    return this.client.send(cmd);
  }
}
