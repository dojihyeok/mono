# MONO api (NestJS + Prisma) — 멀티스테이지 운영 이미지
#
# 설계 의도
#  - builder/runtime 분리: dev 의존성·빌드툴·소스를 최종 이미지에서 제외(이미지 축소·공격면 감소)
#  - 재현 빌드: npm ci(lockfile 고정) 사용
#  - non-root 실행(USER node)
#  - Debian slim: Prisma 엔진의 OpenSSL 3 호환(alpine/musl + openssl1.1 이슈 회피)
#  - 이 이미지는 "앱 런타임"이자 "마이그레이션 러너"를 겸한다
#    → prisma CLI 가 dependencies 에 포함되어 prune 후에도 남는다(docs/migrations.md 참고)
#
# 베이스 digest 핀(권장): 공급망 보안을 위해 태그 대신 digest 로 고정하려면
#   docker pull node:20-slim && docker image inspect node:20-slim --format '{{index .RepoDigests 0}}'
# 결과(node:20-slim@sha256:...)를 아래 두 FROM 에 반영한다.

# ===== Stage 1: builder (dev 의존성 포함, 빌드 전용) =====
FROM node:20-slim AS builder

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치(재현 빌드) — lockfile 변경 없으면 캐시 재사용
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Prisma 클라이언트 생성(소스 없이 스키마만으로 캐시 활용)
COPY prisma ./prisma
RUN npx prisma generate

# 소스 빌드(prebuild 가 prisma generate 재실행)
COPY . .
RUN npm run build

# dev 의존성 제거 후 prisma 클라이언트 재생성(prune 후에도 .prisma/client 보장)
RUN npm prune --omit=dev \
 && npx prisma generate

# ===== Stage 2: runtime (prod 의존성만, non-root) =====
FROM node:20-slim AS runtime

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# 빌드 산출물만 복사(소스·dev툴 제외)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# 엔트리포인트(마이그레이션 적용 분기 → 앱 실행)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 8000

# RUN_MIGRATIONS=1 이면 prisma migrate deploy 후 CMD 실행(docs/migrations.md)
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
