import { Module, Provider } from '@nestjs/common';
import { EmailService } from './email.service';
import { emailConfig } from '../config/email.config';
import { awsConfig } from '../config/aws.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { SesProvider } from './ses.provider';
import { NodemailerProvider } from './nodemailer.provider';

const emailProvider: Provider = {
  provide: 'EmailProvider',
  useFactory: (
    emailConfiguration: ConfigType<typeof emailConfig>,
    awsConfiguration: ConfigType<typeof awsConfig>,
  ) => {
    if (emailConfiguration.useSes) {
      return new SesProvider(emailConfiguration, awsConfiguration);
    }
    return new NodemailerProvider(emailConfiguration);
  },
  inject: [emailConfig.KEY, awsConfig.KEY],
};

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(awsConfig),
  ],
  exports: [EmailService],
  providers: [emailProvider, EmailService],
})
export class EmailModule {}
