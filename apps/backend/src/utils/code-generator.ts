// utils/code-generator.ts
import { randomInt } from 'crypto';

export function generateSixDigitCode(): string {
  const min = 100000;
  const max = 999999;
  return randomInt(min, max + 1).toString();
}
