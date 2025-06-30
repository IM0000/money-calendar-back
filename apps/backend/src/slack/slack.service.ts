import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/constants/error.constant';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import {
  SlackBlock,
  SlackMessageOptions,
  SlackResponse,
  SlackSendMessageOptions,
} from './types/slack.types';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private readonly SLACK_TIMEOUT_MS = 10000;
  private readonly MAX_MESSAGE_LENGTH = 3000;

  constructor(private readonly prisma: PrismaService) {}

  async sendNotificationMessage(
    options: SlackMessageOptions,
  ): Promise<SlackResponse> {
    try {
      if (!this.isValidWebhookUrl(options.webhookUrl)) {
        this.logger.error(
          `Invalid Slack webhook URL for user ${options.webhookUrl}`,
        );
        throw new BadRequestException({
          errorCode: ERROR_CODE_MAP.VALIDATION_002,
          errorMessage: ERROR_MESSAGE_MAP.VALIDATION_002,
        });
      }

      return await this.sendMessage({
        webhookUrl: options.webhookUrl,
        text: options.text,
        blocks: options.blocks,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to send Slack notification: ${error.message}`,
        error.stack,
      );
      throw new ServiceUnavailableException({
        errorCode: ERROR_CODE_MAP.SERVER_003,
        errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
      });
    }
  }

  private async sendMessage(
    options: SlackSendMessageOptions,
  ): Promise<SlackResponse> {
    const { webhookUrl, text, blocks } = options;

    if (text.length > this.MAX_MESSAGE_LENGTH) {
      this.logger.error(
        `Slack message text exceeds ${this.MAX_MESSAGE_LENGTH} characters: ${text.length}`,
      );
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.VALIDATION_001,
        errorMessage: `Slack 메시지가 최대 길이 ${this.MAX_MESSAGE_LENGTH}자를 초과했습니다`,
      });
    }

    const payload = {
      text,
      ...(blocks && { blocks }),
    };

    try {
      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: this.SLACK_TIMEOUT_MS,
        maxRedirects: 0,
      });

      if (response.status !== 200 || response.data !== 'ok') {
        throw new Error(
          `Slack API returned unexpected response: ${response.data}`,
        );
      }

      this.logger.log(`Slack message sent successfully`);
      return { ok: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          this.logger.error('Slack webhook request timed out');
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: 'Slack webhook 요청이 시간 초과되었습니다',
          });
        }
        if (error.response?.status === 404) {
          this.logger.error('Slack webhook URL not found (404)');
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: 'Slack webhook URL을 찾을 수 없습니다',
          });
        }
        if (error.response?.status === 403) {
          this.logger.error('Slack webhook access forbidden (403)');
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: 'Slack webhook 접근이 금지되었습니다',
          });
        }
        if (error.response?.status >= 400 && error.response?.status < 500) {
          this.logger.error(
            `Slack client error (${error.response.status}): ${error.message}`,
          );
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: 'Slack 요청이 잘못되었습니다',
          });
        }
        if (error.response?.status >= 500) {
          this.logger.error(
            `Slack server error (${error.response.status}): ${error.message}`,
          );
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
          });
        }
      }

      this.logger.error(`Failed to send Slack message: ${error.message}`);
      throw new ServiceUnavailableException({
        errorCode: ERROR_CODE_MAP.SERVER_003,
        errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
      });
    }
  }

  private isValidWebhookUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.protocol === 'https:' &&
        parsedUrl.hostname === 'hooks.slack.com' &&
        parsedUrl.pathname.startsWith('/services/')
      );
    } catch {
      return false;
    }
  }

  createNotificationBlocks(title: string, content: string): SlackBlock[] {
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
