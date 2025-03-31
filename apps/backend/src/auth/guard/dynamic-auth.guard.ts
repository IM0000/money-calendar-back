// src/auth/guards/dynamic-auth.guard.ts
import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { OAuthGuardFactory } from './../strategies/oauth-strategy.factory';
import { Observable } from 'rxjs';

@Injectable()
export class DynamicAuthGuard implements CanActivate {
  constructor(private readonly oAuthGuardFactory: OAuthGuardFactory) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider;
    const guard = this.oAuthGuardFactory.get(provider);

    // OAuth 연결 요청인지 확인하고 세션에 저장
    const oauthMethod = request.query.oauthMethod;
    if (oauthMethod === 'connect' && request.user) {
      // 세션에 계정 연결 요청 정보 저장
      if (!request.session) {
        request.session = {};
      }
      request.session.oauthMethod = 'connect';
      request.session.userId = request.user.id;
    }

    return guard.canActivate(context); // 동적으로 AuthGuard를 호출
  }
}
