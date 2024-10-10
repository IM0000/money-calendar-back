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

    return guard.canActivate(context); // 동적으로 AuthGuard를 호출
  }
}
