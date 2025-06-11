#!/bin/bash
set -e

echo "Setting up Blue-Green deployment configuration..."

# AWS Systems Manager Parameter Store나 환경변수에서 대상그룹 ARN 가져오기
if [ -n "$TARGET_GROUP_3000_ARN" ] && [ -n "$TARGET_GROUP_3001_ARN" ]; then
    # 환경변수로 설정된 경우
    echo "$TARGET_GROUP_3000_ARN" > /home/ec2-user/target_group_3000_arn
    echo "$TARGET_GROUP_3001_ARN" > /home/ec2-user/target_group_3001_arn
    echo "Target group ARNs loaded from environment variables"
elif aws ssm get-parameter --name "/moneycalendar/TARGET_GROUP_3000_ARN" --region ap-northeast-2 >/dev/null 2>&1; then
    # Parameter Store에서 가져오기
    TARGET_GROUP_3000_ARN=$(aws ssm get-parameter --name "/moneycalendar/TARGET_GROUP_3000_ARN" --query 'Parameter.Value' --output text --region ap-northeast-2)
    TARGET_GROUP_3001_ARN=$(aws ssm get-parameter --name "/moneycalendar/TARGET_GROUP_3001_ARN" --query 'Parameter.Value' --output text --region ap-northeast-2)
    
    echo "$TARGET_GROUP_3000_ARN" > /home/ec2-user/target_group_3000_arn
    echo "$TARGET_GROUP_3001_ARN" > /home/ec2-user/target_group_3001_arn
    echo "Target group ARNs loaded from Parameter Store"
else
    # Auto-discovery를 시도 (태그 기반)
    echo "Attempting auto-discovery of target groups..."
    
    TARGET_GROUP_3000_ARN=$(aws elbv2 describe-target-groups --region ap-northeast-2 --query "TargetGroups[?contains(Tags[?Key=='Name'].Value, 'money-3000')].TargetGroupArn" --output text 2>/dev/null || echo "")
    TARGET_GROUP_3001_ARN=$(aws elbv2 describe-target-groups --region ap-northeast-2 --query "TargetGroups[?contains(Tags[?Key=='Name'].Value, 'money-3001')].TargetGroupArn" --output text 2>/dev/null || echo "")
    
    if [ -n "$TARGET_GROUP_3000_ARN" ] && [ -n "$TARGET_GROUP_3001_ARN" ]; then
        echo "$TARGET_GROUP_3000_ARN" > /home/ec2-user/target_group_3000_arn
        echo "$TARGET_GROUP_3001_ARN" > /home/ec2-user/target_group_3001_arn
        echo "Target group ARNs discovered automatically"
    else
        echo "ERROR: Could not find target group ARNs"
        echo "Please set them manually or via environment variables:"
        echo "- TARGET_GROUP_3000_ARN"
        echo "- TARGET_GROUP_3001_ARN"
        echo "Or create them in Parameter Store:"
        echo "- /moneycalendar/TARGET_GROUP_3000_ARN"
        echo "- /moneycalendar/TARGET_GROUP_3001_ARN"
        exit 1
    fi
fi

# 초기 상태 설정 (첫 배포시)
if [ ! -f "/home/ec2-user/current_active_port" ]; then
    echo "none" > /home/ec2-user/current_active_port
fi

# AWS CLI 권한 확인
aws sts get-caller-identity > /dev/null || {
    echo "ERROR: AWS CLI credentials not configured"
    exit 1
}

# 필요한 ALB 권한 확인
aws elbv2 describe-target-groups --region ap-northeast-2 --output text > /dev/null || {
    echo "ERROR: Missing ELB permissions"
    exit 1
}

echo "Blue-Green deployment setup completed!"
echo "Target group ARNs configured:"
echo "- 3000 port: $(cat /home/ec2-user/target_group_3000_arn)"
echo "- 3001 port: $(cat /home/ec2-user/target_group_3001_arn)" 