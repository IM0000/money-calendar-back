import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { appendFile, mkdir } from 'fs/promises';

@Injectable({ scope: Scope.TRANSIENT })
export class TerminusLogger extends ConsoleLogger {
  async error(message: any, stack?: string, context?: string): Promise<void>;
  async error(message: any, ...optionalParams: any[]): Promise<void>;
  async error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
  ): Promise<void> {
    super.error(message, stack as string, context as string);

    await mkdir('logs', { recursive: true });

    const timestamp = new Date().toISOString();
    const ctx = context ?? 'Terminus';
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    const stk = stack ?? '';
    const line = `${timestamp} [${ctx}] ERROR: ${msg} ${stk}\n`;
    await appendFile('logs/terminus-errors.log', line);
  }
}
