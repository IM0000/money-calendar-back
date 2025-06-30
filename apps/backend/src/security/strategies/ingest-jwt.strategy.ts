import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/constants/error.constant';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class IngestJwtStrategy extends PassportStrategy(Strategy, 'ingestJwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 토큰 추출
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
    if (payload.type !== 'ingest') {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE_MAP.AUTH_002,
        errorMessage: ERROR_MESSAGE_MAP.AUTH_002,
      });
    }
    return payload;
  }
}
