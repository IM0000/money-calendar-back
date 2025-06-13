#!/bin/bash
set -e

# AWS 리전 설정
AWS_REGION=${AWS_REGION:-ap-northeast-2}

# 배포 대상 포트와 현재 활성 포트 읽기
DEPLOY_TARGET_PORT=$(cat /home/ec2-user/deploy_target_port)
CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port)
CONTAINER_NAME="app-$DEPLOY_TARGET_PORT"

echo "Starting container $CONTAINER_NAME on port $DEPLOY_TARGET_PORT"
sudo docker start $CONTAINER_NAME

# 1) 로컬 헬스체크
echo "Waiting for health check on port $DEPLOY_TARGET_PORT..."
for i in {1..30}; do
    if curl -f http://localhost:$DEPLOY_TARGET_PORT/health 2>/dev/null; then
        echo "Health check passed!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Health check failed after 30 attempts"
        exit 1
    fi
    echo "Attempt $i/30 failed, retrying in 2 seconds..."
    sleep 2
done

# 2) ALB 리스너 Default Target Group 교체
LISTENER_ARN=$(cat /home/ec2-user/alb_listener_arn)
TARGET_GROUP_3000_ARN=$(cat /home/ec2-user/target_group_3000_arn)
TARGET_GROUP_3001_ARN=$(cat /home/ec2-user/target_group_3001_arn)

if [ "$DEPLOY_TARGET_PORT" = "3000" ]; then
    NEW_TARGET_GROUP_ARN=$TARGET_GROUP_3000_ARN
else
    NEW_TARGET_GROUP_ARN=$TARGET_GROUP_3001_ARN
fi

echo "Switching ALB listener default target group to $NEW_TARGET_GROUP_ARN"
aws elbv2 modify-listener \
    --listener-arn $LISTENER_ARN \
    --default-actions Type=forward,TargetGroupArn=$NEW_TARGET_GROUP_ARN \
    --region $AWS_REGION

# 3) ALB 헬스체크 상태 확인
echo "Waiting for ALB health check to pass..."
for i in {1..60}; do
    HEALTH_STATUS=$(aws elbv2 describe-target-health \
        --target-group-arn $NEW_TARGET_GROUP_ARN \
        --query 'TargetHealthDescriptions[0].TargetHealth.State' \
        --output text \
        --region $AWS_REGION || echo "")
    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo "ALB health check passed!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "ALB health check failed after 60 attempts"
        exit 1
    fi
    echo "ALB health status: $HEALTH_STATUS, waiting... ($i/60)"
    sleep 5
done

# 4) 이전 컨테이너 완전 삭제 (이미지는 보존됨)
if [ "$CURRENT_ACTIVE_PORT" != "none" ]; then
    echo "Removing old container app-$CURRENT_ACTIVE_PORT"
    sudo docker stop app-$CURRENT_ACTIVE_PORT 2>/dev/null || true
    sudo docker rm app-$CURRENT_ACTIVE_PORT 2>/dev/null || true
fi

# 5) 상태 파일 업데이트
echo "$DEPLOY_TARGET_PORT" > /home/ec2-user/current_active_port

echo "Blue-Green deployment completed successfully"