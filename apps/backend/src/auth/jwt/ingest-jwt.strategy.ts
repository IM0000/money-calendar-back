import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { ingestJwtConfig } from '../../config/ingest-jwt.config';

@Injectable()
export class IngestJwtStrategy extends PassportStrategy(Strategy, 'ingestJwt') {
  constructor(
    @Inject(ingestJwtConfig.KEY)
    private ingestJwtConfiguration: ConfigType<typeof ingestJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 토큰 추출
      ignoreExpiration: false, // 만료된 토큰을 무시하지 않음
      secretOrKey: ingestJwtConfiguration.secret, // 비밀 키 설정
    });
  }

  /**
   * JWT 토큰이 유효하면 호출되는 메서드
   * @param payload JWT 페이로드
   * @returns 사용자 정보
   */
  async validate(payload: any) {
    return payload; // Request에 사용자 정보 저장
  }
}
