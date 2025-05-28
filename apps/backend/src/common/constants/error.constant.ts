export const ERROR_CODE_MAP = {
  // 인증(Authentication) 관련 에러
  AUTH_001: 'AUTH_001', // 인증 토큰 유효하지 않음
  AUTH_002: 'AUTH_002', // 인증 실패 (잘못된 자격 증명)
  AUTH_003: 'AUTH_003', // 토큰 누락
  AUTH_004: 'AUTH_004', // 토큰 무효화
  AUTH_005: 'AUTH_005', // 리프레시 토큰 유효하지 않음
  AUTH_006: 'AUTH_006', // 아이디 또는 비밀번호 오류

  // 권한(Authorization) 관련 에러
  AUTHZ_001: 'AUTHZ_001', // 권한 없음 (403 Forbidden)
  AUTHZ_002: 'AUTHZ_002', // 접근 제한된 리소스

  // 유효성 검사(Validation) 관련 에러
  VALIDATION_001: 'VALIDATION_001', // 필수 필드 누락
  VALIDATION_002: 'VALIDATION_002', // 잘못된 형식 (예: 이메일 형식 오류)
  VALIDATION_003: 'VALIDATION_003', // 비밀번호 기준 미충족
  VALIDATION_004: 'VALIDATION_004', // 입력 값 범위 초과

  // 리소스(Resource) 관련 에러
  RESOURCE_001: 'RESOURCE_001', // 리소스 없음 (404 Not Found)
  RESOURCE_002: 'RESOURCE_002', // 리소스 중복 (409 Conflict)
  RESOURCE_003: 'RESOURCE_003', // 리소스 삭제 불가

  // 충돌(Conflict) 관련 에러
  CONFLICT_001: 'CONFLICT_001', // 데이터 충돌 (예: 중복된 사용자 등록)

  // 서버 오류(Server Error) 관련 에러
  SERVER_001: 'SERVER_001', // 내부 서버 오류 (500 Internal Server Error)
  SERVER_002: 'SERVER_002', // 데이터베이스 연결 실패
  SERVER_003: 'SERVER_003', // 외부 서비스 오류

  // 잘못된 요청(Bad Request) 관련 에러
  BAD_REQUEST_001: 'BAD_REQUEST_001', // 잘못된 요청 형식
  BAD_REQUEST_002: 'BAD_REQUEST_002', // 잘못된 쿼리 파라미터
  BAD_REQUEST_003: 'BAD_REQUEST_003', // 요청 본문 오류

  // 속도 제한(Rate Limiting) 관련 에러
  RATE_LIMIT_001: 'RATE_LIMIT_001', // 요청 속도 제한 초과

  // 계정(Account) 관련 에러
  ACCOUNT_001: 'ACCOUNT_001', // 비밀번호 미설정 (비밀번호가 없거나 초기화 필요)

  // OAuth 관련 에러
  OAUTH_001: 'OAUTH_001', // oauth 인증 실패
  OAUTH_002: 'OAUTH_002', // oauth 지원하지 않는 인증기관

  // 기타 에러
  UNKNOWN_001: 'UNKNOWN_001', // 알 수 없는 오류
} as const;

export type ERROR_CODE = (typeof ERROR_CODE_MAP)[keyof typeof ERROR_CODE_MAP];

export const ERROR_MESSAGE_MAP = {
  [ERROR_CODE_MAP.AUTH_001]: '인증 토큰이 유효하지 않습니다.',
  [ERROR_CODE_MAP.AUTH_002]: '잘못된 자격 증명입니다.',
  [ERROR_CODE_MAP.AUTH_003]: '요청에 토큰이 포함되어 있지 않습니다.',
  [ERROR_CODE_MAP.AUTH_004]: '토큰이 무효화되었습니다. 다시 인증해주세요.',
  [ERROR_CODE_MAP.AUTH_005]:
    '리프레시 토큰이 유효하지 않습니다. 재로그인이 필요합니다.',
  [ERROR_CODE_MAP.AUTH_006]:
    '아이디 또는 비밀번호가 일치하지 않습니다. 다시 시도해주세요.',

  [ERROR_CODE_MAP.AUTHZ_001]: '권한이 없습니다.',
  [ERROR_CODE_MAP.AUTHZ_002]: '접근이 제한된 리소스입니다.',

  [ERROR_CODE_MAP.VALIDATION_001]: '필수 입력값이 누락되었습니다.',
  [ERROR_CODE_MAP.VALIDATION_002]: '입력이 올바르지 않습니다.',
  [ERROR_CODE_MAP.VALIDATION_003]: '비밀번호 형식이 기준을 충족하지 않습니다.',
  [ERROR_CODE_MAP.VALIDATION_004]: '입력 값이 허용 범위를 벗어났습니다.',

  [ERROR_CODE_MAP.RESOURCE_001]: '요청한 리소스를 찾을 수 없습니다.',
  [ERROR_CODE_MAP.RESOURCE_002]: '이미 존재하는 리소스입니다.',
  [ERROR_CODE_MAP.RESOURCE_003]: '리소스를 삭제할 수 없습니다.',

  [ERROR_CODE_MAP.CONFLICT_001]: '데이터 충돌이 발생했습니다.',

  [ERROR_CODE_MAP.SERVER_001]: '서버 내부 오류가 발생했습니다.',
  [ERROR_CODE_MAP.SERVER_002]: '데이터베이스 연결에 실패했습니다.',
  [ERROR_CODE_MAP.SERVER_003]: '외부 서비스 오류가 발생했습니다.',

  [ERROR_CODE_MAP.BAD_REQUEST_001]: '잘못된 요청 형식입니다.',
  [ERROR_CODE_MAP.BAD_REQUEST_002]: '쿼리 파라미터가 올바르지 않습니다.',
  [ERROR_CODE_MAP.BAD_REQUEST_003]: '요청 본문에 오류가 있습니다.',

  [ERROR_CODE_MAP.RATE_LIMIT_001]:
    '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',

  [ERROR_CODE_MAP.ACCOUNT_001]: '비밀번호가 설정되지 않았습니다.',

  [ERROR_CODE_MAP.OAUTH_001]: 'OAuth 인증에 실패했습니다.',
  [ERROR_CODE_MAP.OAUTH_002]: '지원하지 않는 OAuth 인증기관입니다.',

  [ERROR_CODE_MAP.UNKNOWN_001]: '알 수 없는 오류가 발생했습니다.',
} as const;

export type ERROR_MESSAGE =
  (typeof ERROR_MESSAGE_MAP)[keyof typeof ERROR_MESSAGE_MAP];
