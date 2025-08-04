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
  DiscordEmbed,
  DiscordMessageOptions,
  DiscordResponse,
  DiscordSendMessageOptions,
} from './types/discord.types';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly DISCORD_TIMEOUT_MS = 10000;
  private readonly MAX_MESSAGE_LENGTH = 2000;
  private readonly MAX_EMBED_TITLE_LENGTH = 256;
  private readonly MAX_EMBED_DESCRIPTION_LENGTH = 4096;

  constructor(private readonly prisma: PrismaService) {}

  async sendNotificationMessage(
    options: DiscordMessageOptions,
  ): Promise<DiscordResponse> {
    try {
      if (!this.isValidWebhookUrl(options.webhookUrl)) {
        this.logger.error(
          `Invalid Discord webhook URL for user ${options.webhookUrl}`,
        );
        throw new BadRequestException({
          errorCode: ERROR_CODE_MAP.VALIDATION_002,
          errorMessage: ERROR_MESSAGE_MAP.VALIDATION_002,
        });
      }

      return await this.sendMessage({
        webhookUrl: options.webhookUrl,
        content: options.content,
        embeds: options.embeds,
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
        `Failed to send Discord notification: ${error.message}`,
        error.stack,
      );
      throw new ServiceUnavailableException({
        errorCode: ERROR_CODE_MAP.SERVER_003,
        errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
      });
    }
  }

  private async sendMessage(
    options: DiscordSendMessageOptions,
  ): Promise<DiscordResponse> {
    const { webhookUrl, content, embeds } = options;

    if (content && content.length > this.MAX_MESSAGE_LENGTH) {
      this.logger.error(
        `Discord message content exceeds ${this.MAX_MESSAGE_LENGTH} characters: ${content.length}`,
      );
      throw new BadRequestException({
        errorCode: ERROR_CODE_MAP.VALIDATION_001,
        errorMessage: `Discord 메시지가 최대 길이 ${this.MAX_MESSAGE_LENGTH}자를 초과했습니다`,
      });
    }

    const payload: any = {};
    
    if (content) {
      payload.content = content;
    }
    
    if (embeds && embeds.length > 0) {
      // Embed 유효성 검사
      embeds.forEach((embed, index) => {
        if (embed.title && embed.title.length > this.MAX_EMBED_TITLE_LENGTH) {
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_001,
            errorMessage: `Discord embed ${index + 1}의 제목이 최대 길이 ${this.MAX_EMBED_TITLE_LENGTH}자를 초과했습니다`,
          });
        }
        if (embed.description && embed.description.length > this.MAX_EMBED_DESCRIPTION_LENGTH) {
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_001,
            errorMessage: `Discord embed ${index + 1}의 설명이 최대 길이 ${this.MAX_EMBED_DESCRIPTION_LENGTH}자를 초과했습니다`,
          });
        }
      });
      
      payload.embeds = embeds;
    }

    try {
      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: this.DISCORD_TIMEOUT_MS,
        maxRedirects: 0,
      });

      if (response.status !== 204 && response.status !== 200) {
        throw new Error(
          `Discord API returned unexpected response: ${response.status}`,
        );
      }

      this.logger.log(`Discord message sent successfully`);
      return { ok: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          this.logger.error('Discord webhook request timed out');
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: 'Discord webhook 요청이 시간 초과되었습니다',
          });
        }
        if (error.response?.status === 404) {
          this.logger.error('Discord webhook URL not found (404)');
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: 'Discord webhook URL을 찾을 수 없습니다',
          });
        }
        if (error.response?.status === 401) {
          this.logger.error('Discord webhook unauthorized (401)');
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: 'Discord webhook 인증이 실패했습니다',
          });
        }
        if (error.response?.status === 429) {
          this.logger.error('Discord webhook rate limited (429)');
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: 'Discord webhook 요청 한도를 초과했습니다',
          });
        }
        if (error.response?.status >= 400 && error.response?.status < 500) {
          this.logger.error(
            `Discord client error (${error.response.status}): ${error.message}`,
          );
          throw new BadRequestException({
            errorCode: ERROR_CODE_MAP.VALIDATION_002,
            errorMessage: 'Discord 요청이 잘못되었습니다',
          });
        }
        if (error.response?.status >= 500) {
          this.logger.error(
            `Discord server error (${error.response.status}): ${error.message}`,
          );
          throw new ServiceUnavailableException({
            errorCode: ERROR_CODE_MAP.SERVER_003,
            errorMessage: ERROR_MESSAGE_MAP.SERVER_003,
          });
        }
      }

      this.logger.error(`Failed to send Discord message: ${error.message}`);
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
        (parsedUrl.hostname === 'discord.com' || parsedUrl.hostname === 'discordapp.com') &&
        parsedUrl.pathname.includes('/webhooks/')
      );
    } catch {
      return false;
    }
  }

  createNotificationEmbed(title: string, description: string, color?: number): DiscordEmbed {
    return {
      title,
      description,
      color: color || 0x7289da, // Discord 브랜드 컬러
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Money Calendar',
      },
    };
  }
}