# syntax=docker/dockerfile:1

###############################################################################
# 1) Builder 스테이지 - 빌드 및 Prisma 생성
###############################################################################
FROM node:22-alpine AS builder
WORKDIR /app

# 1-0) AppSpec 파일 복사 (이미지에도 포함)
COPY appspec.yml ./appspec.yml

# 필요한 빌드 의존성 설치
RUN apk add --no-cache openssl libc6-compat

# 1-1) 의존성 설치를 위한 파일 복사
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# 1-2) Prisma 스키마 및 소스코드 복사
COPY prisma ./prisma/
COPY nest-cli.json tsconfig.build.json tsconfig.json ./
COPY apps/backend ./apps/backend/

# 1-3) Prisma Client 생성 및 백엔드 빌드
RUN pnpm exec prisma generate --schema=prisma/schema.prisma
RUN pnpm run build:backend

# 1-4) production 의존성만 다시 설치 (devDependencies 제외)
# Prisma 관련 파일은 이미 생성되어 있으므로 --prod로 설치해도 문제 없음
RUN pnpm prune --prod

###############################################################################
# 2) Runner 스테이지 (최종 이미지)
###############################################################################
FROM node:22-alpine AS runner
WORKDIR /app

# Alpine에서 Prisma를 위한 최소 의존성만 설치 및 보안 설정
RUN apk add --no-cache openssl libc6-compat && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# 2-1) Node_modules와 Prisma 관련 파일 모두 복사 
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# 2-2) 빌드 결과물 복사
COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/backend ./dist

# 2-3) AppSpec 파일도 복사
COPY --from=builder --chown=nodejs:nodejs /app/appspec.yml ./appspec.yml

# 환경 설정
ENV NODE_ENV=production
ENV PRISMA_BINARY_PLATFORM="linux-musl"

# 보안 강화를 위해 비특권 사용자로 실행
USER nodejs

EXPOSE 3000
CMD ["node", "dist/src/main.js"]