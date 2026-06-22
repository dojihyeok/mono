# MONO DB 명세서 (PostgreSQL)

> ORM: Prisma 5 · 원본: `api/prisma/schema.prisma` · 마이그레이션: `api/prisma/migrations/`
> 회원번호 = **`User.id`(cuid)** 를 PK로, 모든 자식 테이블이 **`userId` 외래키**로 참조.
> 갱신: 2026-06-21

---

## 관계도(ERD 요약)

```
                ┌──────────────┐
                │    User      │  (회원, PK=id cuid)
                └──────┬───────┘
        ┌────────┬─────┼─────────┬──────────────┐
        ▼        ▼     ▼         ▼              ▼
  CareerCard Certificate Education InterestRegistration AnalyticsEvent
   (Cascade)  (Cascade)  (Cascade)   (SetNull)          (SetNull)
```
- **Cascade**: 회원 삭제 시 함께 삭제(경력·자격·교육)
- **SetNull**: 회원 삭제돼도 행은 남고 userId만 NULL(관심·이벤트 — 익명 통계 보존)

---

## 테이블

### User — 회원
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | text(cuid) | **PK** | 회원번호 |
| phone | text | **UNIQUE**, null 허용 | 휴대폰 |
| email | text | **UNIQUE**, null 허용 | 이메일 |
| name | text | null 허용 | 이름 |
| jobType | text[] | default `{}`(1개 이상 선택) | 직군(복수) |
| careerYears | **CareerBand**(enum) | null 허용 | 경력 구간 |
| region | text[] | default `{}`(1개 이상 선택) | 희망 지역(복수) |
| createdAt | timestamptz | default now() | 생성 |
| updatedAt | timestamptz | @updatedAt | 수정 |

> 가입은 phone/email **둘 중 하나 필수**(앱/ api 레이어 검증). 둘 다 UNIQUE → 중복가입 차단.

### CareerCard — 현장 경력
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | text(cuid) | PK | |
| userId | text | **FK→User.id (Cascade)**, INDEX | 회원 |
| siteName | text | NOT NULL | 현장명 |
| field | text | null | 작업 분야 |
| startDate / endDate | timestamptz | null | 근무 기간 |
| role | text | null | 역할 |
| equipment | text | null | 사용 장비 |
| coworkers | text | null | 함께 일한 사람 |
| memo | text | null | 메모 |
| createdAt | timestamptz | default now() | |

### Certificate — 자격증
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | text(cuid) | PK | |
| userId | text | **FK→User.id (Cascade)**, INDEX | 회원 |
| name | text | NOT NULL | 자격증명 |
| licenseNo | text | **NOT NULL** | 발급번호(자격증 번호) |
| issuer | text | null | 발급기관 |
| issuedAt | timestamptz | null | 취득일 |
| createdAt | timestamptz | default now() | |

### Education — 교육 이력
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | text(cuid) | PK | |
| userId | text | **FK→User.id (Cascade)**, INDEX | 회원 |
| title | text | NOT NULL | 교육명 |
| institute | text | null | 기관 |
| completedAt | timestamptz | null | 이수일 |
| createdAt | timestamptz | default now() | |

### InterestRegistration — 관심 기능 신청
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | text(cuid) | PK | |
| userId | text | **FK→User.id (SetNull)**, null 허용, INDEX | 회원(익명 가능) |
| feature | **InterestFeature**(enum) | NOT NULL | 관심 기능 |
| createdAt | timestamptz | default now() | |

> (userId, feature) 동일 신청은 앱/ api 에서 idempotent 처리(중복 미생성).

### AnalyticsEvent — 행동 이벤트 로그
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | text(cuid) | PK | |
| userId | text | **FK→User.id (SetNull)**, null 허용, INDEX | 회원(익명 가능) |
| name | text | NOT NULL, **INDEX** | 이벤트명(카탈로그: `web/lib/analytics.ts`) |
| props | jsonb | null | 부가 속성 |
| createdAt | timestamptz | default now() | |

---

## enum

### CareerBand — 경력 구간(버킷)
| 값 | 표시문구 |
|---|---|
| UNDER_1Y | 1년 미만 |
| Y1_3 | 1~3년 |
| Y3_5 | 3~5년 |
| Y5_10 | 5~10년 |
| OVER_10Y | 10년 이상 |

### InterestFeature — 관심 기능
| 값 | 의미 |
|---|---|
| CAREER_VERIFICATION | 경력 인증 |
| FINANCE_BENEFIT | 금융 혜택 |
| EQUIPMENT_RENTAL | 공구·장비 대여 |
| FOREIGN_WORKER | 외국인 체류·고용 관리 |
| SAFE_PAYMENT | 안심 정산 |
| COMPANY_VIEW | 기업 열람권 |

---

## 인덱스 / 제약 요약
- **PK**: 모든 테이블 `id`(cuid)
- **UNIQUE**: `User.phone`, `User.email`
- **FK**: CareerCard/Certificate/Education `.userId` → User.id (**Cascade**) · InterestRegistration/AnalyticsEvent `.userId` → User.id (**SetNull**)
- **INDEX**: 모든 자식 테이블 `userId`, `AnalyticsEvent.name`

## 마이그레이션
```bash
# 로컬(컨테이너)에서 적용
docker compose exec api npx prisma migrate deploy
# 스키마 변경 → 새 마이그레이션 생성(개발)
cd api && npx prisma migrate dev --name <변경명>
```
> 운영(EKS)에서는 `prisma migrate deploy` 를 배포 Job/initContainer 로 실행.
