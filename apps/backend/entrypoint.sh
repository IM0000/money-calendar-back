#!/usr/bin/env sh
set -e

# 1) DB 마이그레이션 실행
pnpx prisma migrate deploy --schema=prisma/schema.prisma

# 2) 애플리케이션 시작
exec node dist/src/main.js