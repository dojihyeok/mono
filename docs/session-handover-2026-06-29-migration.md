# Session Handover: 2026-06-29 (MoNo Architecture Migration)

## 1. 개요 (Overview)
- 기존 단일 Next.js 구조로 혼재되어 있던 `~/mono` 로컬 환경을 새로운 `YOungJEEE/MoNo.git` 아키텍처로 완전히 병합/이관했습니다.
- **백엔드(`api`)**와 **프론트엔드(`web`)**가 완벽히 분리된 구조로 업데이트되었습니다.
- 기존 SQLite에서 PostgreSQL 기반(`docker-compose.yml`)으로 인프라가 재편되었습니다.

## 2. 변경된 아키텍처 및 포트 구성
이전 환경(포트폴리오 환경에서 작업됨)과 충돌을 피하기 위해 `docker-compose.yml` 포트 매핑이 다음과 같이 수정되었습니다:
- **web (Next.js)**: `3004` 포트 바인딩 (기존 `trydit`의 3000번 포트 충돌 방지 및 Nginx의 `mono.dojiung.com` 리버스 프록시 연동 유지)
- **api (NestJS/Backend)**: `8004` 포트 바인딩
- **db (PostgreSQL)**: `5434` 포트 바인딩
- **redis**: `6384` 포트 바인딩

## 3. 배포 상태
- 이관된 코드는 `dojihyeok/mono` 레포지토리의 `main` 브랜치에 푸시 완료되었습니다. (`feat: migrate to new monorepo architecture from YOungJEEE/MoNo`)
- 프로덕션 서버(`49.50.139.88`) 상에서 `docker compose up -d --build`를 통해 정상적으로 구동 및 배포되었습니다.
- `https://mono.dojiung.com/analys` 및 메인 도메인이 정상적으로 200/307 응답을 주며 렌더링되고 있음을 확인했습니다.

## 4. 인수인계 내용 (다음 세션을 위한 안내)
해당 마이그레이션 작업은 사용자가 `portfolio` 워크스페이스 세션에 있을 때 진행되었으나, 실제 파일과 Git 변경 사항은 온전히 `mono` 프로젝트 디렉토리(`~/mono`)에 반영되었습니다.
- **다음 작업자(Agent)**는 본 핸드오버 문서를 바탕으로 새로운 `web`/`api` 분리 구조 위에서 작업을 이어나가면 됩니다.
- 환경변수(`.env`)는 기존 파일을 보존하였으나, 필요에 따라 `web/.env` 혹은 `api/.env` 셋업을 추가적으로 정비할 필요가 있을 수 있습니다 (현재는 Docker Compose 환경변수와 기본값으로 안정 구동 중).
