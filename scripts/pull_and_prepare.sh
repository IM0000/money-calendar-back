#!/bin/bash
set -e

# 1) 최신 이미지를 GHCR에서 pull
IMAGE=ghcr.io/im0000/money-calendar-backend:latest
docker pull $IMAGE

# 2) 컨테이너를 '정지된 상태'로 미리 생성 (빠른 시작 준비)
docker create --name app_new \
  --env-file /home/ec2-user/app.env \
  -p 80:3000 \
  $IMAGE