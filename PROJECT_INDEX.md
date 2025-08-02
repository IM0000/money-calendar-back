# Money Calendar 프로젝트 종합 인덱스 📈

> 주식 시장 이벤트 수집 및 사용자 맞춤 알림 서비스의 완전한 개발 가이드

## 📋 프로젝트 개요

**Money Calendar**는 주식 실적, 배당, 경제지표를 자동 수집하고 사용자에게 맞춤형 알림을 제공하는 백엔드 서비스입니다.

- **버전**: 0.0.1
- **언어**: TypeScript
- **프레임워크**: NestJS
- **데이터베이스**: PostgreSQL + Prisma ORM
- **패키지 관리**: pnpm 9.5.0

## 🏗️ 아키텍처 개요

### 전체 시스템 구성

```
Money Calendar System
├── Backend API Server (Port 3000)     # RESTful API, 사용자 관리, 알림
├── Scraping Server                     # 데이터 수집 및 처리
├── PostgreSQL Database                 # 데이터 저장소
├── Redis Cache                        # 세션 및 캐시
└── External Services                  # Email (SES), OAuth Providers
```

### 모듈 아키텍처

```
apps/
├── backend/                           # 웹 API 서버
│   ├── auth/                         # 인증 및 OAuth
│   ├── user/                         # 사용자 관리
│   ├── company/                      # 회사 정보
│   ├── calendar/                     # 캘린더 API
│   ├── notification/                 # 알림 시스템
│   ├── search/                       # 검색 기능
│   ├── favorite/                     # 즐겨찾기
│   ├── subscription/                 # 구독 관리
│   └── config/                       # 환경설정
└── scraping/                         # 데이터 수집 서버
    ├── scraping/                     # 웹 스크래핑
    ├── ingest/                       # 데이터 처리
    └── transport/                    # 데이터 전송
```

## 🎯 핵심 기능

### 1. 데이터 수집 (Scraping)

- **실적 데이터**: 기업 실적 발표 일정 및 결과
- **배당 정보**: 배당 지급일, 배당률, 배당 이력
- **경제지표**: 주요 경제지표 발표 일정 및 수치
- **회사 정보**: 기업 기본 정보 및 메타데이터

### 2. 사용자 관리

- **인증 시스템**: JWT + OAuth (Google, Kakao, Apple, Discord)
- **사용자 프로필**: 닉네임, 이메일 인증, 선호 설정
- **세션 관리**: 리프레시 토큰, 자동 로그인

### 3. 알림 서비스

- **이메일 알림**: AWS SES 또는 SMTP
- **Slack 알림**: 웹훅 기반 알림
- **Discord 알림**: 웹훅 기반 알림 (Embed 형태)
- **실시간 알림**: Server-Sent Events (SSE)
- **스케줄링**: Cron 기반 배치 처리

### 4. 데이터 관리

- **즐겨찾기**: 관심 회사 및 경제지표 저장
- **구독**: 알림 받을 항목 선택
- **검색**: 회사명, 경제지표 검색
- **캘린더**: 날짜별 이벤트 조회

## 📊 데이터베이스 스키마

### 핵심 엔티티

```typescript
// 사용자 관리
User; // 사용자 기본 정보
UserNotificationSettings; // 알림 설정
OAuthAccount; // OAuth 연동 계정

// 회사 및 금융 데이터
Company; // 회사 정보
Earnings; // 실적 데이터
Dividend; // 배당 정보
EconomicIndicator; // 경제지표

// 사용자 선호
FavoriteCompany; // 즐겨찾기 회사
FavoriteIndicatorGroup; // 즐겨찾기 경제지표
SubscriptionCompany; // 구독 회사
SubscriptionIndicatorGroup; // 구독 경제지표

// 알림 시스템
Notification; // 알림 이력
```

## 🔧 개발 환경 설정

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd backend-project
pnpm install
```

### 2. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
pnpm prisma:generate:dev

# 개발 환경 마이그레이션
pnpm prisma:migrate:dev

# 프로덕션 배포
pnpm prisma:migrate:deploy
```

### 3. 환경변수 설정

```bash
# 백엔드 환경변수
cp apps/backend/src/config/env/.development.env.example \
   apps/backend/src/config/env/.development.env

# 스크래핑 환경변수
cp apps/scraping/src/config/env/.development.env.example \
   apps/scraping/src/config/env/.development.env
```

### 4. 서버 실행

```bash
# 개발 모드
pnpm start:dev:backend    # http://localhost:3000
pnpm start:dev:scraping

# 프로덕션 모드
pnpm start:backend
pnpm start:scraping
```

## 🧪 테스트 전략

### 테스트 명령어

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test:cov

# E2E 테스트
pnpm test:e2e:backend
pnpm test:e2e:scraping

# 특정 모듈 테스트
pnpm jest auth
pnpm jest user
```

### 테스트 커버리지 현황

- **현재 커버리지 리포트**: `coverage/lcov-report/index.html`
- **목표 커버리지**: 단위 테스트 90%, 통합 테스트 70%

## 📁 디렉토리 구조 상세

### Backend API Server (`apps/backend/`)

```
src/
├── main.ts                          # 애플리케이션 진입점
├── app.module.ts                     # 루트 모듈

├── auth/                            # 인증 모듈
│   ├── auth.controller.ts           # 로그인, 회원가입 API
│   ├── auth.service.ts              # 인증 비즈니스 로직
│   ├── auth.repository.ts           # 데이터 액세스 ✅
│   ├── dto/                         # 인증 DTO
│   └── strategies/                  # Passport 전략

├── user/                            # 사용자 관리
│   ├── user.controller.ts           # 사용자 프로필 API
│   ├── user.service.ts              # 사용자 비즈니스 로직
│   ├── user.repository.ts           # [계획됨] 데이터 액세스
│   └── dto/                         # 사용자 DTO

├── company/                         # 회사 정보
│   ├── company.controller.ts        # 회사 정보 API
│   ├── company.service.ts           # 회사 비즈니스 로직
│   └── company.repository.ts        # 데이터 액세스 ✅

├── calendar/                        # 캘린더 API
│   ├── calendar.controller.ts       # 캘린더 이벤트 API
│   ├── calendar.service.ts          # 캘린더 비즈니스 로직
│   ├── calendar.repository.ts       # 데이터 액세스 ✅
│   └── dto/                         # 캘린더 DTO

├── notification/                    # 알림 시스템
│   ├── notification.controller.ts   # 알림 API
│   ├── notification.service.ts      # 알림 비즈니스 로직
│   ├── notification.repository.ts   # 데이터 액세스 ✅
│   ├── notification.listener.ts     # 이벤트 리스너
│   ├── notification.scheduler.ts    # 스케줄링
│   ├── message-builders/            # 메시지 빌더
│   ├── queue/                       # 큐 시스템
│   ├── sse/                         # Server-Sent Events
│   └── workers/                     # 백그라운드 작업

├── search/                          # 검색 기능
│   ├── search.controller.ts         # 검색 API
│   ├── search.service.ts            # 검색 비즈니스 로직
│   ├── search.repository.ts         # 데이터 액세스 ✅
│   └── dto/                         # 검색 DTO

├── favorite/                        # 즐겨찾기
│   ├── favorite.controller.ts       # 즐겨찾기 API
│   ├── favorite.service.ts          # 즐겨찾기 비즈니스 로직
│   └── dto/                         # 즐겨찾기 DTO

├── subscription/                    # 구독 관리
│   ├── subscription.controller.ts   # 구독 API
│   ├── subscription.service.ts      # 구독 비즈니스 로직
│   ├── subscription.repository.ts   # [계획됨] 데이터 액세스
│   └── dto/                         # 구독 DTO

├── security/                        # 보안 모듈
│   ├── guards/                      # 인증 가드
│   ├── strategies/                  # OAuth 전략
│   └── factories/                   # 전략 팩토리

├── common/                          # 공통 모듈
│   ├── constants/                   # 상수 정의
│   ├── decorators/                  # 커스텀 데코레이터
│   ├── filters/                     # 예외 필터
│   ├── interceptor/                 # 인터셉터
│   ├── types/                       # 타입 정의
│   └── utils/                       # 유틸리티

├── config/                          # 환경설정
│   ├── env/                         # 환경변수 파일
│   ├── validation/                  # 설정 검증
│   └── *.config.ts                  # 서비스별 설정

├── email/                           # 이메일 서비스
│   ├── email.service.ts             # 이메일 전송 로직
│   ├── nodemailer.provider.ts       # SMTP 제공자
│   └── ses.provider.ts              # AWS SES 제공자

├── slack/                           # Slack 연동
│   ├── slack.service.ts             # Slack 메시지 전송
│   └── types/                       # Slack 타입

├── prisma/                          # Prisma 설정
│   ├── prisma.service.ts            # Prisma 클라이언트
│   └── prisma.module.ts             # Prisma 모듈

└── health/                          # 헬스체크
    ├── health.controller.ts         # 헬스체크 API
    └── terminus-logger.service.ts   # 로깅
```

### Scraping Server (`apps/scraping/`)

```
src/
├── main.ts                          # 스크래핑 서버 진입점
├── app.module.ts                     # 루트 모듈

├── scraping/                        # 웹 스크래핑
│   ├── scraping.controller.ts       # 스크래핑 API
│   ├── scraping.service.ts          # 스크래핑 오케스트레이션
│   ├── dto/                         # 스크래핑 DTO
│   ├── interfaces/                  # 스크래퍼 인터페이스
│   ├── parsers/                     # 데이터 파서
│   │   ├── base-parser.ts           # 기본 파서
│   │   ├── investing-dividend-parser.ts
│   │   ├── investing-earnings-parser.ts
│   │   ├── investing-economic-parser.ts
│   │   └── naver-company-parser.ts
│   ├── services/                    # 스크래핑 서비스
│   │   ├── base-scraper.service.ts
│   │   ├── investing-dividend-scraping.service.ts
│   │   ├── investing-earnings-scraping.service.ts
│   │   ├── investing-economic-scraping.service.ts
│   │   └── naver-company-scraping.service.ts
│   └── utils/                       # 스크래핑 유틸리티

├── ingest/                          # 데이터 처리
│   ├── ingest.controller.ts         # 데이터 처리 API
│   └── ingest.service.ts            # 데이터 변환 및 검증

├── transport/                       # 데이터 전송
│   ├── transport.service.ts         # 백엔드로 데이터 전송
│   └── transport.module.ts          # 전송 모듈

├── auth/                            # JWT 인증
│   ├── auth.service.ts              # 내부 인증
│   └── auth.module.ts               # 인증 모듈

├── persistence/                     # 임시 저장
│   ├── persistence.service.ts       # 데이터 임시 저장
│   └── persistence.module.ts        # 저장 모듈

└── common/                          # 공통 컴포넌트
    ├── constants/                   # 국가코드 등 상수
    ├── decorators/                  # 날짜 검증 등
    ├── exceptions/                  # 스크래핑 예외
    ├── filters/                     # 예외 필터
    ├── interceptors/                # 로깅 인터셉터
    └── utils/                       # 공통 유틸리티
```

## 🔐 보안 및 인증

### OAuth 제공자

```typescript
// 지원되는 OAuth 제공자
enum OAuthProvider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  APPLE = 'apple',
  DISCORD = 'discord',
}
```

### 인증 플로우

1. **OAuth 로그인**: 외부 제공자 통해 인증
2. **JWT 토큰 발급**: 액세스 토큰 + 리프레시 토큰
3. **세션 관리**: 리프레시 토큰으로 자동 갱신
4. **권한 검증**: 가드를 통한 API 접근 제어

### 보안 기능

- **JWT 기반 인증**: 상태 없는 인증 시스템
- **리프레시 토큰**: 보안성과 사용성 균형
- **CORS 설정**: 크로스 오리진 요청 제어
- **Rate Limiting**: API 호출 제한
- **입력 검증**: DTO 기반 데이터 검증

## 📡 API 문서

### API 접근

- **Swagger UI**: http://localhost:3000/api/docs
- **Backend Server**: http://localhost:3000
- **API Prefix**: `/api/v1`

### 주요 엔드포인트

```typescript
// 인증
POST /auth/login               # 이메일/비밀번호 로그인
POST /auth/register            # 회원가입
GET  /auth/oauth/:provider     # OAuth 로그인
POST /auth/refresh             # 토큰 갱신
POST /auth/logout              # 로그아웃

// 사용자
GET  /users/profile            # 프로필 조회
PUT  /users/profile            # 프로필 수정
PUT  /users/password           # 비밀번호 변경

// 캘린더
GET  /calendar/events          # 캘린더 이벤트 조회
GET  /calendar/earnings        # 실적 캘린더
GET  /calendar/dividends       # 배당 캘린더
GET  /calendar/indicators      # 경제지표 캘린더

// 검색
GET  /search/companies         # 회사 검색
GET  /search/indicators        # 경제지표 검색

// 즐겨찾기
GET  /favorites                # 즐겨찾기 조회
POST /favorites/companies      # 회사 즐겨찾기 추가
DELETE /favorites/companies/:id # 회사 즐겨찾기 제거

// 구독
GET  /subscriptions            # 구독 조회
POST /subscriptions/companies  # 회사 구독
DELETE /subscriptions/companies/:id # 회사 구독 해제

// 알림
GET  /notifications            # 알림 이력
GET  /notifications/sse        # 실시간 알림 (SSE)
PUT  /notifications/settings   # 알림 설정
```

## 🔄 데이터 플로우

### 1. 데이터 수집 플로우

```
External Sources → Scraping Server → Data Processing → Backend DB
                                          ↓
                                   Notification Queue
                                          ↓
                                   Email/Slack Workers
```

### 2. 사용자 알림 플로우

```
Scheduled Job → Check Subscriptions → Generate Notifications → Send Alerts
                      ↓                        ↓                    ↓
                 User Preferences      Notification History    Email/Slack
```

### 3. 실시간 알림 플로우

```
Event Trigger → Event Emitter → SSE Service → Client Browser
                     ↓               ↓
            Notification Queue   Real-time Updates
```

## 🚀 배포 및 운영

### 빌드 명령어

```bash
# 전체 빌드
pnpm build

# 개별 빌드
pnpm build:backend
pnpm build:scraping
```

### 배포 스크립트

```bash
# Blue-Green 배포 설정
./scripts/setup_blue_green.sh

# 새 버전 시작
./scripts/start_new.sh

# 롤백
./scripts/rollback.sh

# 정리
./scripts/cleanup.sh
```

### 모니터링

- **헬스체크**: `/health` 엔드포인트
- **로그 파일**: `logs/terminus-errors.log`
- **메트릭스**: 응답 시간, 에러율, 처리량

## 📈 성능 최적화

### 데이터베이스 최적화

- **인덱스**: 주요 쿼리 최적화
- **풀 텍스트 검색**: PostgreSQL FTS 활용
- **쿼리 최적화**: N+1 문제 해결
- **캐싱**: Redis 기반 캐시 전략

### 애플리케이션 최적화

- **레이어 분리**: Repository 패턴 적용
- **비동기 처리**: Queue 기반 백그라운드 작업
- **배치 처리**: 대량 데이터 효율적 처리
- **압축**: Gzip 압축 활용

### 아키텍처 개선 효과

1. **ORM 교체 용이성**: Repository Interface 통해 구현체 교체 가능
2. **테스트 개선**: Service와 Repository 계층 분리로 모킹 용이
3. **코드 품질**: 단일 책임 원칙 준수, 관심사 분리
4. **유지보수성**: 데이터 액세스 로직 중앙화

## 🎯 개발 로드맵

### Phase 1: Repository Pattern 완성 (진행중)

- [x] Company, Auth, Calendar, Notification, Search
- [ ] User, Favorite, Subscription Repository 구현
- [ ] 단위 테스트 업데이트

### Phase 2: 성능 최적화

- [ ] 쿼리 최적화 및 인덱스 개선
- [ ] 캐시 전략 강화
- [ ] API 응답 시간 개선

### Phase 3: 기능 확장

- [ ] 모바일 푸시 알림
- [ ] 고급 필터링 및 정렬
- [ ] 다국어 지원

### Phase 4: 운영 개선

- [ ] 모니터링 대시보드
- [ ] 자동 배포 파이프라인
- [ ] 장애 복구 자동화

## 📚 추가 리소스

### 개발 가이드

- **API 설계 가이드**: RESTful API 설계 원칙
- **데이터베이스 설계**: 정규화 및 성능 고려사항
- **테스트 전략**: 단위, 통합, E2E 테스트 가이드
- **보안 가이드**: 인증, 권한, 데이터 보호

### 외부 문서

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

_이 문서는 Money Calendar 프로젝트의 종합 개발 가이드입니다. 프로젝트 이해와 개발에 필요한 모든 정보를 포함하고 있습니다._

**마지막 업데이트**: 2025-02-02
**문서 버전**: 1.0.0
