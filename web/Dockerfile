# MONO web (Next.js 14 App Router) — 멀티스테이지 standalone 운영 이미지
#  - builder: 의존성 설치 + 빌드 / runtime: standalone 산출물만(non-root)
#  - output:"standalone"(next.config) 전제 → .next/standalone/server.js 실행
#  - prisma: postinstall 의 `prisma generate` 가 스키마를 필요로 해 schema 를 먼저 복사
#  - 런타임 env: API_URL(필수, 컨테이너에선 http://api:8000), DATABASE_URL(web 이 prisma 로 DB 접근 시)

# ===== Stage 1: builder =====
FROM node:20-slim AS builder
WORKDIR /app

# 재현 빌드 — lockfile 고정. prisma generate(postinstall)용 schema 먼저 복사.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# 소스 빌드 → .next/standalone 생성
COPY . .
RUN npm run build

# ===== Stage 2: runtime (standalone, non-root) =====
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Next standalone 필수 3종: server 번들 + 정적자산 + public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
