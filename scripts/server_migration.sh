#!/bin/bash
# MONO Server-side Migration Script
# 이 스크립트는 기존 운영 폴더를 백업하고, 구 버전 페이지(Port 3005) 및 피치 페이지(Port 3004)를 기동하며 Nginx 설정을 반영합니다.
set -e

echo "============================================="
echo "   🚀 MONO SERVER MIGRATION STARTING...      "
echo "============================================="

# 1. 기존 코드 상태를 /root/mono-old 경로로 설정 및 체크아웃 (shallow clone 대응 및 크리덴셜 승계)
if [ ! -d "/root/mono-old/.git" ]; then
  echo "[STEP 1] /root/mono-old 가 존재하지 않거나 Git 저장소가 아닙니다. 로컬 클론을 시작합니다..."
  sudo rm -rf /root/mono-old || true
  git clone /root/mono /root/mono-old
fi

echo "동기화 및 구 버전 코드 펫치..."
cd /root/mono-old
# /root/mono 의 origin remote URL 을 그대로 가져와서 설정 (크리덴셜 동일 적용)
ORIGIN_URL=$(git -C /root/mono config --get remote.origin.url)
git remote set-url origin "$ORIGIN_URL"

# main 브랜치(구 버전 상태)를 depth 1로 펫치하여 크리덴셜 오류 없이 리셋
git fetch origin main --depth=1
git reset --hard origin/main
npm ci
echo "✔ 구 버전 코드 체크아웃 및 종속성 설치가 완료되었습니다."

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

# 백업 복사본이 /root/mono/unified_services_final_new 에 있으므로 해당 파일 내용을 반영
if [ -f "/root/mono/unified_services_final_new" ]; then
  # 1. 중복 충돌을 방지하기 위해 /etc/nginx/sites-enabled/default 파일 제거
  if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo "✔ 기존 default 설정(/etc/nginx/sites-enabled/default)을 제거하여 중복 충돌을 방지합니다."
    sudo rm -f /etc/nginx/sites-enabled/default
  fi

  # 2. sites-available 에 최신 설정 복사
  echo "✔ unified_services_final_new 설정을 /etc/nginx/sites-available/unified_services_final 로 복사합니다."
  sudo cp /root/mono/unified_services_final_new /etc/nginx/sites-available/unified_services_final

  # 3. sites-enabled 에 심링크 생성 (존재하지 않는 경우)
  if [ ! -L "/etc/nginx/sites-enabled/unified_services_final" ]; then
    echo "✔ /etc/nginx/sites-enabled/unified_services_final 심링크를 생성합니다."
    sudo ln -sf /etc/nginx/sites-available/unified_services_final /etc/nginx/sites-enabled/unified_services_final
  fi
  
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
