#!/bin/bash
# =============================================================
# Mono 서버 Self-Hosted Runner 설치 스크립트
# 실행: bash setup-runner.sh <GITHUB_TOKEN>
# 토큰 발급: https://github.com/dojihyeok/mono/settings/actions/runners/new
# =============================================================

set -e

TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "❌ 사용법: bash setup-runner.sh <GITHUB_REGISTRATION_TOKEN>"
  echo ""
  echo "토큰 발급 방법:"
  echo "  1. https://github.com/dojihyeok/mono/settings/actions/runners/new 접속"
  echo "  2. 'Configure' 섹션의 토큰 복사 (./config.sh 명령어에서 --token 뒤의 값)"
  exit 1
fi

RUNNER_DIR="/root/actions-runner"
REPO_URL="https://github.com/dojihyeok/mono"

echo "📁 Runner 디렉토리 생성..."
mkdir -p $RUNNER_DIR
cd $RUNNER_DIR

echo "⬇️  Runner 다운로드..."
RUNNER_VERSION="2.323.0"
curl -o actions-runner-linux-x64.tar.gz -L \
  "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"

echo "📦 압축 해제..."
tar xzf actions-runner-linux-x64.tar.gz
rm actions-runner-linux-x64.tar.gz

echo "⚙️  Runner 설정..."
./config.sh \
  --url $REPO_URL \
  --token $TOKEN \
  --name "mono-server" \
  --work "/root/actions-runner/_work" \
  --labels "self-hosted,linux,mono" \
  --unattended \
  --replace

echo "🔧 서비스로 등록 (자동 시작)..."
./svc.sh install
./svc.sh start

echo ""
echo "✅ Self-Hosted Runner 설치 완료!"
echo "   상태 확인: /root/actions-runner/svc.sh status"
echo "   GitHub에서 확인: https://github.com/dojihyeok/mono/settings/actions/runners"
