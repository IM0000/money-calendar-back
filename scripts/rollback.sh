#!/bin/bash
set -e

# AWS 리전 설정
AWS_REGION=${AWS_REGION:-ap-northeast-2}

echo "Starting image-based rollback process..."

# Docker 이미지 설정 확인
if [ ! -f "/home/ec2-user/docker_image_base" ]; then
    echo "ERROR: Docker image base not configured"
    exit 1
fi

IMAGE_BASE=$(cat /home/ec2-user/docker_image_base)

# 현재 상태 읽기
CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port)

if [ "$CURRENT_ACTIVE_PORT" = "none" ]; then
    echo "No active deployment found. Nothing to rollback."
    exit 1
fi

# 이전 포트 계산
if [ "$CURRENT_ACTIVE_PORT" = "3000" ]; then
    ROLLBACK_PORT=3001
else
    ROLLBACK_PORT=3000
fi

echo "Rolling back from port $CURRENT_ACTIVE_PORT to port $ROLLBACK_PORT"

# 이전 이미지 확인
if [ ! -f "/home/ec2-user/previous_image" ]; then
    echo "ERROR: No previous image found for rollback"
    exit 1
fi

PREVIOUS_IMAGE=$(cat /home/ec2-user/previous_image)
ROLLBACK_IMAGE="$IMAGE_BASE:previous"

echo "Rolling back to image: $PREVIOUS_IMAGE"

# ARN 읽기
LISTENER_ARN=$(cat /home/ec2-user/alb_listener_arn)
TARGET_GROUP_3000_ARN=$(cat /home/ec2-user/target_group_3000_arn)
TARGET_GROUP_3001_ARN=$(cat /home/ec2-user/target_group_3001_arn)

if [ "$ROLLBACK_PORT" = "3000" ]; then
    ROLLBACK_TARGET_GROUP_ARN=$TARGET_GROUP_3000_ARN
else
    ROLLBACK_TARGET_GROUP_ARN=$TARGET_GROUP_3001_ARN
fi

# 1) 이전 이미지로 새 컨테이너 생성
ROLLBACK_CONTAINER_NAME="app-$ROLLBACK_PORT"

echo "Creating rollback container with previous image"
sudo docker create --name $ROLLBACK_CONTAINER_NAME \
  --env-file /home/ec2-user/app.env \
  -p $ROLLBACK_PORT:3000 \
  $ROLLBACK_IMAGE

# 2) 롤백 컨테이너 시작
echo "Starting rollback container: $ROLLBACK_CONTAINER_NAME"
sudo docker start $ROLLBACK_CONTAINER_NAME

# 3) 로컬 헬스체크
echo "Waiting for rollback container health check..."
for i in {1..30}; do
    if curl -f http://localhost:$ROLLBACK_PORT/health 2>/dev/null; then
        echo "Rollback container health check passed!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Rollback container health check failed"
        exit 1
    fi
    echo "Attempt $i/30 failed, retrying in 2 seconds..."
    sleep 2
done

# 4) ALB 리스너 대상그룹 변경
echo "Switching ALB listener to rollback version..."
aws elbv2 modify-listener \
    --listener-arn $LISTENER_ARN \
    --default-actions Type=forward,TargetGroupArn=$ROLLBACK_TARGET_GROUP_ARN \
    --region $AWS_REGION

# 5) ALB 헬스체크 통과 대기
echo "Waiting for ALB health check on rollback target..."
for i in {1..60}; do
    HEALTH_STATUS=$(aws elbv2 describe-target-health \
        --target-group-arn $ROLLBACK_TARGET_GROUP_ARN \
        --query 'TargetHealthDescriptions[0].TargetHealth.State' \
        --output text \
        --region $AWS_REGION || echo "")
    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo "ALB health check passed for rollback target!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "ALB health check failed for rollback target"
        exit 1
    fi
    echo "ALB health status: $HEALTH_STATUS, waiting... ($i/60)"
    sleep 5
done

# 6) 현재 컨테이너 정리
CURRENT_CONTAINER_NAME="app-$CURRENT_ACTIVE_PORT"
echo "Removing current container: $CURRENT_CONTAINER_NAME"
sudo docker stop $CURRENT_CONTAINER_NAME 2>/dev/null || true
sudo docker rm $CURRENT_CONTAINER_NAME 2>/dev/null || true

# 7) 상태 파일 업데이트
echo "$ROLLBACK_PORT" > /home/ec2-user/current_active_port

# 8) 이미지 정보 업데이트
echo "$ROLLBACK_IMAGE" > /home/ec2-user/current_image

echo "Image-based rollback completed successfully!"
echo "Active port rolled back from $CURRENT_ACTIVE_PORT to $ROLLBACK_PORT"
echo "Using image: $PREVIOUS_IMAGE" 