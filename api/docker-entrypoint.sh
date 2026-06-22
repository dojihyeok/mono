#!/bin/sh
# MONO api 컨테이너 엔트리포인트
#  - RUN_MIGRATIONS=1 : 컨테이너 시작 시 prisma migrate deploy 로 대기 중 마이그레이션 적용(로컬/dev 편의)
#  - 그 외           : 마이그레이션을 건너뛴다(운영=EKS는 별도 마이그레이션 Job 이 적용 → docs/migrations.md)
#
# migrate deploy 는 idempotent: prisma/migrations 의 미적용분만 _prisma_migrations 원장에 따라 적용하며
# 새 마이그레이션을 생성하지 않는다(운영 안전). 로컬 prisma CLI(node_modules/.bin)를 직접 호출 → 네트워크 fetch 없음.
set -e

if [ "${RUN_MIGRATIONS:-0}" = "1" ]; then
  echo "[entrypoint] RUN_MIGRATIONS=1 → applying pending migrations (prisma migrate deploy)"
  ./node_modules/.bin/prisma migrate deploy
  echo "[entrypoint] migrations applied"
else
  echo "[entrypoint] RUN_MIGRATIONS unset → skipping migrations (managed externally, e.g. K8s Job)"
fi

exec "$@"
