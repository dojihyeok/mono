#!/bin/bash
# MONO Server-side Migration Script
# 이 스크립트는 기존 운영 폴더를 백업하고, 구 버전 페이지(Port 3005) 및 피치 페이지(Port 3004)를 기동하며 Nginx 설정을 반영합니다.
set -e

echo "============================================="
echo "   🚀 MONO SERVER MIGRATION STARTING...      "
echo "============================================="

# 1. 기존 코드 상태를 /root/mono-old 경로로 설정 및 체크아웃 (로컬 클론으로 크리덴셜 회피)
if [ ! -d "/root/mono-old/.git" ]; then
  echo "[STEP 1] /root/mono-old 가 존재하지 않거나 Git 저장소가 아닙니다. 로컬 클론을 시작합니다..."
  sudo rm -rf /root/mono-old || true
  git clone /root/mono /root/mono-old
  cd /root/mono-old
  git reset --hard e3d509c
  npm ci
  echo "✔ 구 버전 코드 체크아웃 및 종속성 설치가 완료되었습니다."
else
  echo "[STEP 1] /root/mono-old 저장소가 이미 존재합니다. 최신 로컬 코드로 동기화 후 리셋합니다..."
  cd /root/mono-old
  git remote set-url origin /root/mono || true
  git fetch origin
  git reset --hard e3d509c
  npm ci
  echo "✔ 구 버전 코드 리셋 및 종속성 설치가 완료되었습니다."
fi

# 2. 백업된 /root/mono-old 내부에서 PM2 프로세스 및 포트 설정 기동
echo "[STEP 2] /root/mono-old 폴더로 이동하여 구 버전 Next.js 기동을 준비합니다..."
cd /root/mono-old

echo "기존 동일 프로세스 삭제 시도..."
pm2 delete mono-strategy || true
pm2 delete mono-old-main || true
sleep 2

echo "포트 강제 정리 (Port 3004 & 3005)..."
sudo fuser -k 3004/tcp || true
sudo fuser -k 3005/tcp || true
sleep 2

echo "Next.js 앱 기동 (Prisma 생성 후 기동)..."
npx prisma generate

# Port 3004: Strategy 피치 페이지 전용 기동
echo "피치 전략 페이지용 서버 기동 (Port 3004)..."
DATABASE_URL="file:./prisma/dev.db" PORT=3004 pm2 start node_modules/next/dist/bin/next --name "mono-strategy" --cwd /root/mono-old -- start -p 3004

# Port 3005: 구 버전 메인 사이트(old.mono.dojiung.com) 기동
echo "구 버전 메인 사이트 서버 기동 (Port 3005)..."
DATABASE_URL="file:./prisma/dev.db" PORT=3005 pm2 start node_modules/next/dist/bin/next --name "mono-old-main" --cwd /root/mono-old -- start -p 3005

pm2 save
pm2 list

# 3. Nginx 설정 파일 교체 및 적용
echo "[STEP 3] Nginx 설정 파일을 최신본으로 반영합니다..."

ACTIVE_CONF=$(ls /etc/nginx/sites-enabled/ | head -n 1)
if [ -z "$ACTIVE_CONF" ]; then
  ACTIVE_CONF="default"
fi
echo "탐색된 활성 Nginx 설정 파일명: /etc/nginx/sites-enabled/$ACTIVE_CONF"

# 백업 복사본이 /root/mono/unified_services_final_new 에 있으므로 해당 파일 내용을 반영
if [ -f "/root/mono/unified_services_final_new" ]; then
  echo "✔ unified_services_final_new 설정을 /etc/nginx/sites-enabled/$ACTIVE_CONF 로 복사합니다."
  sudo cp /root/mono/unified_services_final_new /etc/nginx/sites-enabled/$ACTIVE_CONF
  
  echo "Nginx 문법 검사를 실행합니다..."
  sudo nginx -t
  
  echo "Nginx 서비스를 재로드합니다..."
  sudo systemctl reload nginx || sudo service nginx reload
  echo "✔ Nginx 반영 및 서비스 재로드가 성공적으로 수행되었습니다."
else
  echo "⚠ 경고: /root/mono/unified_services_final_new 파일이 존재하지 않아 Nginx 설정을 건너뜁니다."
fi

echo "============================================="
echo "   🎉 SERVER MIGRATION COMPLETED SUCCESSFULLY!"
echo "============================================="
