# ─── 1. 베이스 이미지 지정 ─────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

# ─── 2. pnpm 설치 ─────────────────────────────────────────────────
RUN npm install -g pnpm

# ─── 3. 의존성 설치 (dev + prod) ────────────────────────────────────
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── 4. 애플리케이션 코드 복사 ───────────────────────────────────────
COPY . .

# ─── 5. Prisma 클라이언트 생성 & NestJS 빌드 ────────────────────────
RUN pnpm prisma:generate:backend:prod \
 && pnpm build:backend

# ─── 6. 불필요한 devDependencies 제거 ───────────────────────────────
RUN pnpm prune --prod

# ─── 7. 포트 노출 및 실행 커맨드 ────────────────────────────────────
EXPOSE 3000
CMD ["node", "dist/apps/backend/main.js"]