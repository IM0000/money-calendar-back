import axios, { AxiosError } from 'axios';
import { AuthService } from '../auth/auth.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransportService {
  private readonly TIMEOUT_MS = 10000;
  private readonly ingestApiUrl = process.env.INGEST_API_URL;
  constructor(private readonly authService: AuthService) {}

  async sendScrapedData(sourceName: string, items: any[]): Promise<void> {
    const url = `${this.ingestApiUrl}/ingest/scraped-data`;
    const token = this.authService.generateDataIngestionToken();
    const payload = { sourceName, data: items };

    try {
      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: this.TIMEOUT_MS,
      });

      if (response.status < 200 || response.status >= 300) {
        throw new HttpException(
          `Ingest API responded with status ${response.status}`,
          HttpStatus.BAD_GATEWAY,
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        this.throwAxiosException(err);
      }

      throw new HttpException(
        `Unexpected error in sendScrapedData: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
