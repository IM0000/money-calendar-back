import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // 인증 실패해도 에러를 발생시키지 않고 user를 undefined로 반환
    return user || undefined;
  }
}
