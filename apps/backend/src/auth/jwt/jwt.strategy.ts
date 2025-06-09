import { jwtConfig } from '../../config/jwt.config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/constants/error.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UserService,
  ) {
    console.log('JwtStrategy', jwtConfiguration.expiration);
    console.log('JwtStrategy process', process.env.JWT_EXPIRATION);
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => request.signedCookies?.Authentication as string,
      ] as JwtFromRequestFunction[]), // (1) Authorization 헤더 or signed cookie 'Authentication' 에서 추출
      ignoreExpiration: false, // 만료된 토큰을 무시하지 않음
      secretOrKey: jwtConfiguration.secret, // 비밀 키 설정
    });
  }

  /**
   * JWT 토큰이 유효하면 호출되는 메서드
   * @param payload JWT 페이로드
   * @returns 사용자 정보
   */
  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub); // sub는 사용자 ID
    if (!user) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_001,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_001,
      });
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword; // Request에 사용자 정보 저장
  }
}
