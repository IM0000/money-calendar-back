# Money Calendar ✨

## 📖 개요

주식 시장 이벤트(실적, 배당, 경제지표 등)를 수집·가공하여 API로 제공하고, 사용자 설정에 따른 알림을 제공하는 백엔드 서비스입니다.

## ⚙️ 주요 기능

- **RESTful API (CRUD)**: 사용자, 실적, 배당, 경제지표 등의 데이터 관리
- **데이터 스크래핑**: 주식 시장 데이터 자동 수집 및 가공
- **사용자 인증/인가**: JWT 기반 인증, OAuth 소셜 로그인(Google, Kakao, Apple, Discord)
- **알림 시스템**: 이메일 및 푸시 알림 기능
- **DB 관리**: Prisma + PostgreSQL
- **헬스 체크**: NestJS Terminus

## 🛠️ 기술 스택

| 구분        | 기술 및 라이브러리 |
| ----------- | ------------------ |
| Language    | TypeScript         |
| Framework   | NestJS             |
| ORM         | Prisma             |
| Database    | PostgreSQL         |
| 웹 스크래핑 | Axios, Cheerio     |
| Testing     | Jest               |
| 인증        | Passport, JWT      |
| 이메일      | AWS SES, Nodemailer         |

## 🚀 설치 및 실행

**clone**

```bash
git clone https://github.com/your-username/backend-project.git
cd backend-project
```

**환경변수 설정**

Backend 앱용 환경변수 (apps/backend/src/config/env/.development.env):

```
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5433/mydb?schema=public"

# 서버 설정
SERVER_PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT 설정
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600s
PASSWORD_RESET_JWT_SECRET=your_password_reset_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/oauth/google/callback

# 이메일 설정
EMAIL_SERVICE=Gmail
EMAIL_AUTH_USER=your_email@gmail.com
EMAIL_AUTH_PASSWORD=your_email_app_password
EMAIL_BASE_URL=http://localhost:3000

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY="your_private_key_content"
APPLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/oauth/apple/callback

# Kakao OAuth
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CALLBACK_URL=http://localhost:3000/api/v1/auth/oauth/kakao/callback

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/api/v1/auth/oauth/discord/callback
```

Scraping 앱용 환경변수 (apps/scraping/src/env/.development.env):

```
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5433/mydb?schema=public"
SERVER_PORT=3001
```

**의존성 설치 & 마이그레이션**

```bash
pnpm install
npx prisma migrate deploy
```

**실행**

```bash
# 백엔드 서버 (웹 API)
pnpm start:dev:backend   # 개발 모드
pnpm start:backend       # 프로덕션

# 스크래핑 서버 (데이터 수집)
pnpm start:dev:scraping  # 개발 모드
pnpm start:scraping      # 프로덕션
```

## 📚 API 문서

Swagger UI: http://localhost:3001/api/docs

## 📚 프로젝트 구조

```
backend-project/
├── apps/
│   ├── backend/                 # 웹 API 서버
│   │   ├── src/
│   │   │   ├── app.module.ts    # 메인 모듈
│   │   │   ├── main.ts          # 애플리케이션 진입점
│   │   │   ├── auth/            # 인증 관련 모듈
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── strategies/  # 인증 전략(JWT, OAuth)
│   │   │   ├── users/           # 사용자 관리 모듈
│   │   │   ├── calendar/        # 캘린더 API 모듈
│   │   │   ├── email/           # 이메일 발송 모듈
│   │   │   ├── companies/       # 회사 정보 모듈
│   │   │   ├── favorites/       # 즐겨찾기 모듈
│   │   │   ├── notification/    # 알림 관련 모듈
│   │   │   ├── search/          # 검색 기능 모듈
│   │   │   ├── health/          # 헬스체크 모듈
│   │   │   ├── prisma/          # Prisma 클라이언트 모듈
│   │   │   ├── common/          # 공통 유틸리티, 필터, 인터셉터
│   │   │   ├── config/          # 환경설정 및 구성
│   │   │   │   ├── env/         # 환경변수 파일들
│   │   │   │   └── validation/  # 환경변수 검증
│   │   │   └── shared/          # 공유 모듈 및 기능
│   │   │
│   │   └── test/                # 테스트 파일
│   │
│   └── scraping/                # 데이터 수집 서버
│       ├── src/
│       │   ├── app.module.ts    # 메인 모듈
│       │   ├── main.ts          # 애플리케이션 진입점
│       │   ├── scraping/        # 웹 스크래핑 모듈
│       │   │   ├── scraping.module.ts
│       │   │   ├── scraping.controller.ts
│       │   │   ├── scraping.service.ts
│       │   │   └── dto/         # 데이터 전송 객체
│       │   ├── common/          # 공통 유틸리티
│       │   │   ├── exceptions/  # 예외 처리
│       │   │   ├── filters/     # 예외 필터
│       │   │   ├── interceptors/# 인터셉터
│       │   │   ├── utils/       # 유틸리티 함수
│       │   │   └── constants/   # 상수 정의
│       │   ├── prisma/          # Prisma 클라이언트 모듈
│       │   └── env/             # 환경변수 파일들
│       │
│       └── test/                # 테스트 파일
│
├── prisma/                      # 데이터베이스 스키마
│   ├── schema.prisma            # Prisma 스키마 정의
│   └── migrations/              # 데이터베이스 마이그레이션
│
├── node_modules/                # 패키지 의존성
├── package.json                 # 프로젝트 설정 및 스크립트
├── pnpm-lock.yaml              # 패키지 버전 잠금 파일
├── tsconfig.json               # TypeScript 설정
├── .env                        # 루트 환경변수
├── nest-cli.json               # NestJS CLI 설정
└── .gitignore                  # Git 무시 파일 설정
```

## ✅ 테스트

```bash
# 단위 테스트
pnpm test
```

## 추가 개선점

1. 메일발송을 비동기 메세지 큐로 전환 (BullMQ, RabbitMQ, Kafka)
   -> 알림서버를 신규로 구성하여 이벤트 소비(외부 이메일 서비스 연동 (AWS SES, SendGrid, Mailgun 등))
2. SSE 기반 알림 문제점 보완
   - 인스턴스 수평 확장 불가, 메모리/커넥션 부담
     -> Redis Pub/Sub 이용하여 이벤트 중앙화 및 커넥션 안정성 증대
3. AWS 비용절감을 위한 스크래핑 데이터 저장용 API 추가
4. winston 로거 및 로테이트 파일 적용
5. 모노레포 서비스 코드베이스 분리 -> CI/CD 워크플로우 분리   

## 📄 라이선스

GPL © Sangjun Lim
