/**
 * 에러 코드 정의
 */
export enum ErrorCodes {
  /**
   * 인증(Authentication) 관련 에러
   */
  /** 인증 토큰 만료 */
  AUTH_001 = 'AUTH_001',
  /** 인증 실패 (잘못된 자격 증명) */
  AUTH_002 = 'AUTH_002',
  /** 토큰 누락 */
  AUTH_003 = 'AUTH_003',
  /** 토큰 무효화 */
  AUTH_004 = 'AUTH_004',

  /**
   * 권한(Authorization) 관련 에러
   */
  /** 권한 없음 (403 Forbidden) */
  AUTHZ_001 = 'AUTHZ_001',
  /** 접근 제한된 리소스 */
  AUTHZ_002 = 'AUTHZ_002',

  /**
   * 유효성 검사(Validation) 관련 에러
   */
  /** 필수 필드 누락 */
  VALIDATION_001 = 'VALIDATION_001',
  /** 잘못된 형식 (예: 이메일 형식 오류) */
  VALIDATION_002 = 'VALIDATION_002',
  /** 비밀번호 기준 미충족 */
  VALIDATION_003 = 'VALIDATION_003',
  /** 입력 값 범위 초과 */
  VALIDATION_004 = 'VALIDATION_004',

  /**
   * 리소스(Resource) 관련 에러
   */
  /** 리소스 없음 (404 Not Found) */
  RESOURCE_001 = 'RESOURCE_001',
  /** 리소스 중복 (409 Conflict) */
  RESOURCE_002 = 'RESOURCE_002',
  /** 리소스 삭제 불가 */
  RESOURCE_003 = 'RESOURCE_003',

  /**
   * 충돌(Conflict) 관련 에러
   */
  /** 데이터 충돌 (예: 중복된 사용자 등록) */
  CONFLICT_001 = 'CONFLICT_001',

  /**
   * 서버 오류(Server Error) 관련 에러
   */
  /** 내부 서버 오류 (500 Internal Server Error) */
  SERVER_001 = 'SERVER_001',
  /** 데이터베이스 연결 실패 */
  SERVER_002 = 'SERVER_002',
  /** 외부 서비스 오류 */
  SERVER_003 = 'SERVER_003',

  /**
   * 잘못된 요청(Bad Request) 관련 에러
   */
  /** 잘못된 요청 형식 */
  BAD_REQUEST_001 = 'BAD_REQUEST_001',
  /** 잘못된 쿼리 파라미터 */
  BAD_REQUEST_002 = 'BAD_REQUEST_002',
  /** 요청 본문 오류 */
  BAD_REQUEST_003 = 'BAD_REQUEST_003',

  /**
   * 속도 제한(Rate Limiting) 관련 에러
   */
  /** 요청 속도 제한 초과 */
  RATE_LIMIT_001 = 'RATE_LIMIT_001',

  /**
   * 계정(Account) 관련 에러
   */
  /** 비밀번호 미설정 (비밀번호가 없거나 초기화 필요) */
  ACCOUNT_001 = 'ACCOUNT_001',

  /**
   * 기타 에러
   */
  /** 알 수 없는 오류 */
  UNKNOWN_001 = 'UNKNOWN_001',
}
