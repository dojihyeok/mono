-- 캐노니컬 §0-2: FOREMAN → FIELD_LEADER 비파괴 rename(데이터 보존) + 신규 3유형 추가.
-- Prisma는 enum 멤버 rename을 DROP+ADD(데이터 손실)로 오생성하므로 수동 SQL. (dev-plan §3-4 #1)
ALTER TYPE "UserRole" RENAME VALUE 'FOREMAN' TO 'FIELD_LEADER';
ALTER TYPE "UserRole" ADD VALUE 'CUSTOMER';
ALTER TYPE "UserRole" ADD VALUE 'PROJECT_OPERATOR';
ALTER TYPE "UserRole" ADD VALUE 'PERFORMER_COMPANY';
