#!/bin/bash
set -e

# 1) 이전 컨테이너 중지·삭제
sudo docker stop app || true
sudo docker rm app  || true
sudo rm -rf /home/ec2-user/deploy/*