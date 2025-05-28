import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/constants/error.constant';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.signedCookies?.Authentication;

    if (!token) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_003,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_003,
      });
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err instanceof HttpException) {
      throw err;
    }

    if (info instanceof TokenExpiredError) {
      // 토큰은 있었지만 만료된 경우
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_001,
      });
    }
    if (info instanceof JsonWebTokenError) {
      // 서명 불일치 등 다른 JWT 오류
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_001,
      });
    }

    // user가 아예 없는 경우(guard 통과 실패)
    if (!user) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_001,
      });
    }

    return user;
  }
}
