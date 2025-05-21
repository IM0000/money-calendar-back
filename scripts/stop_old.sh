#!/bin/bash
set -e

# 기존 컨테이너(app) 중지 및 제거
docker stop app || true
docker rm app || true