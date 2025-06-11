#!/bin/bash
set -e

# 배포 대상 포트 읽기 (cleanup.sh에서 설정됨)
DEPLOY_TARGET_PORT=$(cat /home/ec2-user/deploy_target_port)
CONTAINER_NAME="app-$DEPLOY_TARGET_PORT"

echo "Deploying to inactive port: $DEPLOY_TARGET_PORT"

# 1) 최신 이미지를 GHCR에서 pull
IMAGE=ghcr.io/im0000/money-calendar-back:latest
sudo docker pull $IMAGE

# 2) 비활성 포트로 컨테이너를 '정지된 상태'로 미리 생성
sudo docker create --name $CONTAINER_NAME \
  --env-file /home/ec2-user/app.env \
  -p $DEPLOY_TARGET_PORT:3000 \
  $IMAGE

echo "Container $CONTAINER_NAME created on port $DEPLOY_TARGET_PORT"