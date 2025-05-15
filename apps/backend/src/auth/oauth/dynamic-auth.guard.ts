// src/auth/guards/dynamic-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  CanActivate,
  Inject,
  Logger,
} from '@nestjs/common';
import { OAuthGuardFactory } from './oauth-strategy.factory';
import { Observable } from 'rxjs';
import { frontendConfig } from '../../config/frontend.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class DynamicAuthGuard implements CanActivate {
  private readonly logger = new Logger(DynamicAuthGuard.name);
  constructor(
    private readonly oAuthGuardFactory: OAuthGuardFactory,
    @Inject(frontendConfig.KEY)
    private frontendConfiguration: ConfigType<typeof frontendConfig>,
  ) {}

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return { state: request.query.state };
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const provider = request.params.provider;
    const guard = this.oAuthGuardFactory.get(provider);
    guard.getAuthenticateOptions = this.getAuthenticateOptions;

    const frontendURL = this.frontendConfiguration.baseUrl;
    if (request.query.error) {
      const errorMessage =
        request.query.error_description || request.query.error;
      response.redirect(
        `${frontendURL}/auth/error?errorCode=AUTH_002&message=${encodeURIComponent(
          errorMessage,
        )}`,
      );
      return false;
    }

    const state = request.query.state;
    if (state) {
      request.query.state = state;
    }
    return guard.canActivate(context); // 동적으로 AuthGuard를 호출
  }
}
