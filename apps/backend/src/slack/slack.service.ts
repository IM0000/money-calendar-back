import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface SlackMessageOptions {
  userId: number;
  text: string;
  blocks?: any[];
}

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendNotificationMessage(options: SlackMessageOptions): Promise<any> {
    try {
      // 사용자의 알림 설정 조회
      const notificationSettings =
        await this.prisma.userNotificationSettings.findUnique({
          where: { userId: options.userId },
        });

      if (
        !notificationSettings ||
        !notificationSettings.slackEnabled ||
        !notificationSettings.slackWebhookUrl
      ) {
        this.logger.warn(
          `User ${options.userId} has no Slack webhook URL configured or Slack notifications disabled`,
        );
        throw new NotFoundException({
          errorCode: ERROR_CODE_MAP.RESOURCE_001,
          errorMessage:
            'Slack webhook URL not configured or Slack notifications disabled for this user',
        });
      }

      // 슬랙 메시지 전송
      return await this.sendMessage({
        webhookUrl: notificationSettings.slackWebhookUrl,
        text: options.text,
        blocks: options.blocks,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send Slack notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async sendMessage(options: {
    webhookUrl: string;
    text: string;
    blocks?: any[];
  }): Promise<any> {
    const { webhookUrl, text, blocks } = options;

    const payload = {
      text,
      ...(blocks && { blocks }),
    };

    try {
      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send Slack message: ${error.message}`);
      throw new ServiceUnavailableException({
        errorCode: ERROR_CODE_MAP.SERVER_003,
        errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
      });
    }
  }

  createNotificationBlocks(title: string, content: string): any[] {
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: title,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: content,
        },
      },
      {
        type: 'divider',
      },
    ];
  }
}
