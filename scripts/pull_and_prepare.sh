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

# 4) 배포 안전성 검증
CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port 2>/dev/null || echo "none")
if [ "$DEPLOY_TARGET_PORT" = "$CURRENT_ACTIVE_PORT" ] && [ "$CURRENT_ACTIVE_PORT" != "none" ]; then
    echo "CRITICAL ERROR: Attempting to deploy to active port $DEPLOY_TARGET_PORT"
    echo "This would cause service interruption!"
    echo "Current active port: $CURRENT_ACTIVE_PORT"
    echo "Deploy target port: $DEPLOY_TARGET_PORT"
    echo "Please check cleanup.sh logic or state files"
    exit 1
fi

# 5) 환경변수 파일 존재 확인
if [ ! -f "/home/ec2-user/app.env" ]; then
    echo "ERROR: /home/ec2-user/app.env not found"
    echo "Environment variables should have been refreshed in setup_blue_green.sh"
    exit 1
fi

# 6) 비활성 포트로 컨테이너 생성
echo "Creating container $CONTAINER_NAME with new image"
if ! sudo docker create --name $CONTAINER_NAME \
    --env-file /home/ec2-user/app.env \
    -p $DEPLOY_TARGET_PORT:3000 \
    $NEW_IMAGE; then
    echo "ERROR: Failed to create container $CONTAINER_NAME"
    echo "This indicates a serious configuration problem."
    echo "Possible causes:"
    echo "1. Container name conflict (cleanup.sh logic error)"
    echo "2. Port conflict (port calculation error)"
    echo "3. Docker daemon issues"
    echo ""
    echo "ABORTING deployment to prevent service disruption"
    echo "Manual investigation required"
    exit 1
fi

echo "Container $CONTAINER_NAME created on port $DEPLOY_TARGET_PORT"