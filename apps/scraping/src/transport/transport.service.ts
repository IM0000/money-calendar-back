import { urlConfig } from './../config/url.config';
import axios, { AxiosError } from 'axios';
import { AuthService } from '../auth/auth.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TransportService {
  private readonly BATCH_SIZE = 400;
  private readonly TIMEOUT_MS = 10000;
  constructor(
    @Inject(urlConfig.KEY)
    private readonly urlCfg: ConfigType<typeof urlConfig>,
    private readonly authService: AuthService,
  ) {}

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  async sendScrapedData(sourceName: string, items: any[]): Promise<void> {
    const url = `${this.urlCfg.ingestApiUrl}/ingest/scraped-data`;
    const token = this.authService.generateDataIngestionToken();

    const batches = this.chunkArray(items, this.BATCH_SIZE);

    for (const [i, batch] of batches.entries()) {
      try {
        const payload = { sourceName, data: batch };
        const res = await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: this.TIMEOUT_MS,
        });
        if (res.status < 200 || res.status >= 300) {
          throw new HttpException(
            `Batch ${i} failed with status ${res.status}`,
            HttpStatus.BAD_GATEWAY,
          );
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          this.throwAxiosException(err);
        }
        throw new HttpException(
          `Unexpected error on batch ${i}: ${(err as Error).message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private throwAxiosException(err: AxiosError): void {
    if (err.code === 'ECONNABORTED') {
      throw new HttpException(
        `Ingest API timeout after ${this.TIMEOUT_MS}ms`,
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    if (err.response) {
      // Server returned non-2xx status
      const status = err.response.status;
      const message = JSON.stringify(err.response.data) || err.message;
      throw new HttpException(`Ingest API error: ${message}`, status);
    }

    if (err.request) {
      // No response received
      throw new HttpException(
        'No response received from Ingest API',
        HttpStatus.BAD_GATEWAY,
      );
    }

    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
