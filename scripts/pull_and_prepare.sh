#!/bin/bash
set -e

# 배포 대상 포트 읽기
if [ -f "/home/ec2-user/deploy_target_port" ]; then
    DEPLOY_TARGET_PORT=$(cat /home/ec2-user/deploy_target_port)
else
    CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port 2>/dev/null || echo "none")
    
    if [ "$CURRENT_ACTIVE_PORT" = "3000" ]; then
        DEPLOY_TARGET_PORT=3001
    elif [ "$CURRENT_ACTIVE_PORT" = "3001" ]; then
        DEPLOY_TARGET_PORT=3000
    else
        DEPLOY_TARGET_PORT=3000
    fi
    
    echo "$DEPLOY_TARGET_PORT" > /home/ec2-user/deploy_target_port
fi

# Docker 이미지 설정 읽기
if [ ! -f "/home/ec2-user/docker_image_base" ]; then
    echo "ERROR: Docker image base not configured"
    echo "Please run setup_blue_green.sh first"
    exit 1
fi

IMAGE_BASE=$(cat /home/ec2-user/docker_image_base)
CONTAINER_NAME="app-$DEPLOY_TARGET_PORT"
NEW_IMAGE="$IMAGE_BASE:latest"

echo "Deploying to inactive port: $DEPLOY_TARGET_PORT"
echo "Using image base: $IMAGE_BASE"

# 1) 현재 활성 이미지를 previous로 태그 (롤백용)
CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port 2>/dev/null || echo "none")
if [ "$CURRENT_ACTIVE_PORT" != "none" ]; then
    CURRENT_IMAGE=$(sudo docker inspect app-$CURRENT_ACTIVE_PORT --format='{{.Config.Image}}' 2>/dev/null || echo "")
    if [ -n "$CURRENT_IMAGE" ]; then
        echo "Tagging current image as previous for rollback"
        sudo docker tag "$CURRENT_IMAGE" "$IMAGE_BASE:previous"
        echo "$CURRENT_IMAGE" > /home/ec2-user/previous_image
    fi
fi

# 2) 최신 이미지 pull
echo "Pulling latest image: $NEW_IMAGE"
sudo docker pull $NEW_IMAGE

# 3) 새 이미지 정보 저장
echo "$NEW_IMAGE" > /home/ec2-user/current_image

# 4) 비활성 포트로 컨테이너 생성
echo "Creating container $CONTAINER_NAME with new image"
sudo docker create --name $CONTAINER_NAME \
  --env-file /home/ec2-user/app.env \
  -p $DEPLOY_TARGET_PORT:3000 \
  $NEW_IMAGE

echo "Container $CONTAINER_NAME created on port $DEPLOY_TARGET_PORT"