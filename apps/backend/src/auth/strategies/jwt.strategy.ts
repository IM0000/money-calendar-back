// /auth/jwt.strategy.ts
import { jwtConfig } from '../../config/jwt.config';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
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
    const user = await this.usersService.findUserById(payload.sub); // sub는 사용자 ID
    if (!user) {
      throw new Error('유효하지 않은 사용자입니다.');
    }

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword }; // Request에 사용자 정보 저장
  }
}
