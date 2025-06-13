# Money Calendar 📈

> 주식 시장 이벤트(실적, 배당, 경제지표)를 수집하고 사용자 맞춤 알림을 제공하는 백엔드 서비스

## 🚀 주요 기능

- **데이터 수집**: 주식 실적, 배당, 경제지표 자동 스크래핑
- **RESTful API**: 사용자, 회사, 즐겨찾기, 알림 관리
- **인증 시스템**: JWT + OAuth (Google, Kakao, Apple, Discord)
- **알림 서비스**: 이메일 및 Slack 알림
- **검색 기능**: 회사 및 경제지표 검색

## 🛠️ 기술 스택

- **Language**: TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Passport.js, JWT
- **Scraping**: Axios, Cheerio
- **Email**: nodemailer, AWS SES
- **Testing**: Jest

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd backend-project
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
pnpm prisma:generate:dev

# 마이그레이션 실행 (개발 환경)
pnpm prisma:migrate:dev

# 또는 프로덕션 배포용
pnpm prisma:migrate:deploy
```

### 4. 환경변수 설정

```bash
# 환경변수 파일 생성 및 설정
cp apps/backend/src/config/env/.development.env.example apps/backend/src/config/env/.development.env
cp apps/scraping/src/config/env/.development.env.example apps/scraping/src/config/env/.development.env
```

### 5. 서버 실행

```bash
# 백엔드 API 서버 (개발 모드)
pnpm start:dev:backend

# 스크래핑 서버 (개발 모드)
pnpm start:dev:scraping

# 프로덕션 모드
pnpm start:backend
pnpm start:scraping
```

## 📚 API 문서

- **Swagger UI**: http://localhost:3000/api/docs
- **Backend Server**: http://localhost:3000

## 🧪 테스트

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test:cov

# E2E 테스트
pnpm test:e2e:backend
pnpm test:e2e:scraping
```

## 📁 프로젝트 구조

```
backend-project/
├── apps/
│   ├── backend/                 # 웹 API 서버
│   │   └── src/
│   │       ├── auth/            # 인증 모듈
│   │       ├── user/            # 사용자 관리
│   │       ├── company/         # 회사 정보
│   │       ├── calendar/        # 캘린더 API
│   │       ├── notification/    # 알림 시스템
│   │       ├── search/          # 검색 기능
│   │       └── config/          # 환경설정
│   │
│   └── scraping/                # 데이터 수집 서버
│       └── src/
│           ├── scraping/        # 웹 스크래핑
│           ├── ingest/          # 데이터 처리
│           └── transport/       # 데이터 전송
│
├── prisma/                      # 데이터베이스 스키마
└── package.json                 # 프로젝트 설정
```

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.
