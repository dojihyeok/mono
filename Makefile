# MONO 모노레포 — 로컬 인프라(Postgres + Redis + api) 편의 명령
# 사용: `make up` / `make down` / `make logs` / `make migrate` ...
.PHONY: up build down reset logs ps migrate migrate-status migrate-new

up:             ## 전체 스택(db·redis·api) 기동 (백그라운드)
	docker compose up -d

build:          ## api 이미지 재빌드 후 기동 (Dockerfile/소스 변경 반영)
	docker compose up -d --build

down:           ## 컨테이너 정지 (데이터 유지)
	docker compose down

reset:          ## 컨테이너+볼륨 삭제 (데이터 초기화)
	docker compose down -v

logs:           ## 로그 따라가기
	docker compose logs -f

ps:             ## 상태 확인
	docker compose ps

# ── 마이그레이션 (상세: docs/migrations.md) ──
migrate:        ## 대기 마이그레이션 적용 (컨테이너에서 prisma migrate deploy)
	docker compose exec api ./node_modules/.bin/prisma migrate deploy

migrate-status: ## 마이그레이션 적용 상태 확인 (_prisma_migrations 대비)
	docker compose exec api ./node_modules/.bin/prisma migrate status

migrate-new:    ## 새 마이그레이션 생성(호스트) — 사용: make migrate-new name=add_x
	@test -n "$(name)" || { echo "사용법: make migrate-new name=<설명>"; exit 1; }
	cd api && set -a && . ../.env && set +a && npx prisma migrate dev --name $(name)
