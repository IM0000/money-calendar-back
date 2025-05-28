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

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = super.getRequest(context);
    return request;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err instanceof HttpException) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_001,
      });
    }

    return user;
  }
}
