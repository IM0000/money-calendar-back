#!/bin/bash
set -e

# 현재 활성 포트 확인 (ALB 대상그룹 헬스체크를 통해)
ACTIVE_PORT=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4 | xargs -I {} sh -c 'curl -s --connect-timeout 2 http://{}:3000/health && echo 3000 || curl -s --connect-timeout 2 http://{}:3001/health && echo 3001 || echo none')

# 활성 포트가 3000이면 3001을 정리, 3001이면 3000을 정리
if [ "$ACTIVE_PORT" = "3000" ]; then
    INACTIVE_PORT=3001
    INACTIVE_CONTAINER="app-3001"
elif [ "$ACTIVE_PORT" = "3001" ]; then
    INACTIVE_PORT=3000
    INACTIVE_CONTAINER="app-3000"
else
    # 첫 배포이거나 둘 다 죽어있는 경우, 3001을 비활성으로 간주
    INACTIVE_PORT=3001
    INACTIVE_CONTAINER="app-3001"
fi

echo "Active port: $ACTIVE_PORT, Cleaning up inactive port: $INACTIVE_PORT"

# 비활성 포트의 컨테이너만 정리
sudo docker stop $INACTIVE_CONTAINER 2>/dev/null || true
sudo docker rm $INACTIVE_CONTAINER 2>/dev/null || true

# 상태 파일에 현재 설정 저장
echo "$ACTIVE_PORT" > /home/ec2-user/current_active_port
echo "$INACTIVE_PORT" > /home/ec2-user/deploy_target_port