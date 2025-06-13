#!/bin/bash
set -e

# IMDSv2를 사용한 메타데이터 조회
METADATA_BASE="http://169.254.169.254/latest"

# 1) IMDSv2 토큰 발급 - 실패 시 스크립트 종료
TOKEN=$(curl -sX PUT "$METADATA_BASE/api/token" \
    -H "X-aws-ec2-metadata-token-ttl-seconds:21600")

# 2) 헤더 args 설정
HDR_ARGS=(-H "X-aws-ec2-metadata-token: $TOKEN")

# 3) IP 조회 - 실패 시 스크립트 종료
IP=$(curl -sf "${HDR_ARGS[@]}" "$METADATA_BASE/meta-data/local-ipv4")
echo "Instance IP: $IP"

# 4) 활성 포트 감지 (둘 다 실패하면 ACTIVE_PORT='none')
if curl -sf --connect-timeout 2 http://$IP:3000/health; then
    ACTIVE_PORT=3000
elif curl -sf --connect-timeout 2 http://$IP:3001/health; then
    ACTIVE_PORT=3001
else
    ACTIVE_PORT=none
fi

echo "Detected active port: $ACTIVE_PORT"

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