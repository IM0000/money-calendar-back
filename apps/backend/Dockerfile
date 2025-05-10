# ─── 1) Builder 스테이지 ───────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# 의존성만 먼저 복사 → 캐시 활용
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
 && pnpm install --frozen-lockfile

# 코드 복사 후 빌드
COPY . .
RUN pnpm prisma:generate:backend:prod \
 && pnpm build:backend

# ─── 2) Runner 스테이지 ────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# production 의존성만 설치
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
 && pnpm install --prod --frozen-lockfile \
 && pnpm store prune

# 빌드 결과물만 복사
COPY --from=builder /app/dist ./dist

# 실행
EXPOSE 3000
CMD ["node", "dist/apps/backend/main.js"]