-- CreateEnum
CREATE TYPE "JobSiteType" AS ENUM ('TODAY', 'LARGE');

-- AlterTable: JobPost 급구/현장유형 필드화 (BM 검증 P0-1)
ALTER TABLE "JobPost" ADD COLUMN "isUrgent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "JobPost" ADD COLUMN "siteType" "JobSiteType";

-- CreateIndex
CREATE INDEX "JobPost_isUrgent_idx" ON "JobPost"("isUrgent");

-- AlterEnum: ApplicationStatus에 확인중/담당자연락예정 추가
ALTER TYPE "ApplicationStatus" ADD VALUE 'REVIEWING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'CONTACT_PENDING';
