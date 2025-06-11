#!/bin/bash
set -e

# AWS 리전 설정
AWS_REGION=${AWS_REGION:-ap-northeast-2}

echo "Starting rollback process..."

# 현재 상태 읽기
CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port)
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

if [ "$CURRENT_ACTIVE_PORT" = "none" ]; then
    echo "No active deployment found. Nothing to rollback."
    exit 1
fi

# 이전 포트 계산
if [ "$CURRENT_ACTIVE_PORT" = "3000" ]; then
    PREVIOUS_PORT=3001
else
    PREVIOUS_PORT=3000
fi

echo "Rolling back from port $CURRENT_ACTIVE_PORT to port $PREVIOUS_PORT"

# 대상그룹 ARN 읽기
TARGET_GROUP_3000_ARN=$(cat /home/ec2-user/target_group_3000_arn)
TARGET_GROUP_3001_ARN=$(cat /home/ec2-user/target_group_3001_arn)

if [ "$PREVIOUS_PORT" = "3000" ]; then
    ROLLBACK_TARGET_GROUP_ARN=$TARGET_GROUP_3000_ARN
    CURRENT_TARGET_GROUP_ARN=$TARGET_GROUP_3001_ARN
else
    ROLLBACK_TARGET_GROUP_ARN=$TARGET_GROUP_3001_ARN
    CURRENT_TARGET_GROUP_ARN=$TARGET_GROUP_3000_ARN
fi

# 이전 버전 컨테이너가 존재하는지 확인
PREVIOUS_CONTAINER_NAME="app-$PREVIOUS_PORT"
if ! sudo docker ps -a --filter "name=$PREVIOUS_CONTAINER_NAME" --format "table {{.Names}}" | grep -q "$PREVIOUS_CONTAINER_NAME"; then
    echo "ERROR: Previous container $PREVIOUS_CONTAINER_NAME not found"
    exit 1
fi

# 이전 컨테이너 시작
echo "Starting previous container: $PREVIOUS_CONTAINER_NAME"
sudo docker start $PREVIOUS_CONTAINER_NAME 2>/dev/null || {
    echo "Failed to start previous container. It may already be running."
}

# 헬스체크
echo "Waiting for rollback container health check..."
for i in {1..30}; do
    if curl -f http://localhost:$PREVIOUS_PORT/health 2>/dev/null; then
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

# ALB 대상그룹 전환
echo "Switching ALB to previous version..."

# 이전 버전을 대상그룹에 등록
aws elbv2 register-targets --target-group-arn $ROLLBACK_TARGET_GROUP_ARN --targets Id=$INSTANCE_ID,Port=$PREVIOUS_PORT --region $AWS_REGION

# ALB 헬스체크 통과 대기
echo "Waiting for ALB health check on rollback target..."
for i in {1..60}; do
    HEALTH_STATUS=$(aws elbv2 describe-target-health --target-group-arn $ROLLBACK_TARGET_GROUP_ARN --targets Id=$INSTANCE_ID,Port=$PREVIOUS_PORT --query 'TargetHealthDescriptions[0].TargetHealth.State' --output text --region $AWS_REGION)
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

# 현재 버전을 대상그룹에서 제거
echo "Removing current version from target group..."
aws elbv2 deregister-targets --target-group-arn $CURRENT_TARGET_GROUP_ARN --targets Id=$INSTANCE_ID,Port=$CURRENT_ACTIVE_PORT --region $AWS_REGION

# 현재 컨테이너 정지
sleep 10
CURRENT_CONTAINER_NAME="app-$CURRENT_ACTIVE_PORT"
sudo docker stop $CURRENT_CONTAINER_NAME 2>/dev/null || true

# 상태 파일 업데이트
echo "$PREVIOUS_PORT" > /home/ec2-user/current_active_port

echo "Rollback completed successfully!"
echo "Active port rolled back from $CURRENT_ACTIVE_PORT to $PREVIOUS_PORT" 