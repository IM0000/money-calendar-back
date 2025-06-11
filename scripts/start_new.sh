#!/bin/bash
set -e

# AWS 리전 설정
AWS_REGION=${AWS_REGION:-ap-northeast-2}

# 배포 대상 포트와 현재 활성 포트 읽기
DEPLOY_TARGET_PORT=$(cat /home/ec2-user/deploy_target_port)
CURRENT_ACTIVE_PORT=$(cat /home/ec2-user/current_active_port)
CONTAINER_NAME="app-$DEPLOY_TARGET_PORT"

echo "Starting container $CONTAINER_NAME on port $DEPLOY_TARGET_PORT"

# 1) 미리 생성해 둔 컨테이너를 즉시 start
sudo docker start $CONTAINER_NAME

# 2) 헬스체크 - 새 컨테이너가 정상 동작할 때까지 대기
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

# 3) AWS CLI를 사용하여 ALB 대상그룹 전환
# 현재 인스턴스 ID 가져오기
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

# 대상그룹 ARN 설정 (환경변수에서 가져오거나 하드코딩)
TARGET_GROUP_3000_ARN=$(cat /home/ec2-user/target_group_3000_arn)
TARGET_GROUP_3001_ARN=$(cat /home/ec2-user/target_group_3001_arn)

if [ "$DEPLOY_TARGET_PORT" = "3000" ]; then
    NEW_TARGET_GROUP_ARN=$TARGET_GROUP_3000_ARN
    OLD_TARGET_GROUP_ARN=$TARGET_GROUP_3001_ARN
else
    NEW_TARGET_GROUP_ARN=$TARGET_GROUP_3001_ARN
    OLD_TARGET_GROUP_ARN=$TARGET_GROUP_3000_ARN
fi

echo "Switching ALB target groups..."

# 새 대상그룹에 인스턴스 등록
aws elbv2 register-targets --target-group-arn $NEW_TARGET_GROUP_ARN --targets Id=$INSTANCE_ID,Port=$DEPLOY_TARGET_PORT --region $AWS_REGION

# 헬스체크 통과 대기 (ALB 대상그룹 레벨)
echo "Waiting for ALB health check to pass..."
for i in {1..60}; do
    HEALTH_STATUS=$(aws elbv2 describe-target-health --target-group-arn $NEW_TARGET_GROUP_ARN --targets Id=$INSTANCE_ID,Port=$DEPLOY_TARGET_PORT --query 'TargetHealthDescriptions[0].TargetHealth.State' --output text --region $AWS_REGION)
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

# 이전 대상그룹에서 인스턴스 제거 (graceful)
if [ "$CURRENT_ACTIVE_PORT" != "none" ]; then
    echo "Removing from old target group..."
    aws elbv2 deregister-targets --target-group-arn $OLD_TARGET_GROUP_ARN --targets Id=$INSTANCE_ID,Port=$CURRENT_ACTIVE_PORT --region $AWS_REGION
    
    # 잠시 대기 후 이전 컨테이너 정리
    sleep 10
    OLD_CONTAINER_NAME="app-$CURRENT_ACTIVE_PORT"
    sudo docker stop $OLD_CONTAINER_NAME 2>/dev/null || true
    sudo docker rm $OLD_CONTAINER_NAME 2>/dev/null || true
fi

# 상태 파일 업데이트
echo "$DEPLOY_TARGET_PORT" > /home/ec2-user/current_active_port

echo "Blue-Green deployment completed successfully!"
echo "Active port switched from $CURRENT_ACTIVE_PORT to $DEPLOY_TARGET_PORT"