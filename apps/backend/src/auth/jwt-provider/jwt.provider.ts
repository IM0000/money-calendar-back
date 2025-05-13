// jwt.providers.ts
import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../config/jwt.config';
import { ingestJwtConfig } from '../../config/ingest-jwt.config';

export const jwtProviders: Provider[] = [
  {
    provide: 'JWT',
    useFactory: (cfg: ConfigType<typeof jwtConfig>) =>
      new JwtService({
        secret: cfg.secret,
        signOptions: { expiresIn: cfg.expiration },
      }),
    inject: [jwtConfig.KEY],
  },
  {
    provide: 'PASSWORD_RESET_JWT',
    useFactory: (cfg: ConfigType<typeof jwtConfig>) =>
      new JwtService({
        secret: cfg.passwordResetSecret,
        signOptions: { expiresIn: cfg.expiration },
      }),
    inject: [jwtConfig.KEY],
  },
  {
    provide: 'INGEST_JWT',
    useFactory: (cfg: ConfigType<typeof ingestJwtConfig>) =>
      new JwtService({
        secret: cfg.secret,
        signOptions: { expiresIn: cfg.expiration },
      }),
    inject: [ingestJwtConfig.KEY],
  },
];
