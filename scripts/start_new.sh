#!/bin/bash
set -e

# 미리 생성해 둔 app_new 컨테이너를 즉시 start
sudo docker start app_new

# 컨테이너 이름을 다음 배포를 위해 'app'으로 변경
sudo docker rename app_new app