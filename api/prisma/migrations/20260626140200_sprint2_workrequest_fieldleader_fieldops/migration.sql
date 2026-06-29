-- 스프린트2 (dev-plan §3-2): 현장작업요청·현장리더 프로필·팀 가동일정·FieldOps 관심. 전부 비파괴(신규 enum/table, 기존 테이블 nullable/배열 컬럼).

-- CreateEnum
CREATE TYPE "WorkRequestStatus" AS ENUM ('DRAFT', 'OPEN', 'MATCHING', 'ASSIGNED', 'COMPLETED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('DAILY', 'UNIT', 'LUMP_SUM', 'MONTHLY');

-- CreateEnum
CREATE TYPE "TeamAvailabilityStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'PARTIAL', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "FieldOpsFeature" AS ENUM ('EQUIPMENT_TOOL', 'SMART_EQUIPMENT', 'MATERIAL_ORDER', 'PACKAGE', 'MEAL_LODGING', 'EDUCATION', 'INSURANCE');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "avgCareerBand" "CareerBand",
ADD COLUMN     "equipOperators" INTEGER,
ADD COLUMN     "industries" "IndustryType"[],
ADD COLUMN     "regions" TEXT[],
ADD COLUMN     "safetyRate" DOUBLE PRECISION,
ADD COLUMN     "workTypes" TEXT[];

-- CreateTable
CREATE TABLE "FieldLeaderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryJobTypes" TEXT[],
    "manageableTeamSize" INTEGER,
    "mainWorkFields" TEXT[],
    "industries" "IndustryType"[],
    "regions" TEXT[],
    "partnerCompanyIds" TEXT[],
    "contactHours" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldLeaderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamAvailability" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "weekStart" TEXT NOT NULL,
    "status" "TeamAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "regions" TEXT[],
    "urgentOk" BOOLEAN NOT NULL DEFAULT false,
    "assignedSiteName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "industry" "IndustryType" NOT NULL,
    "workTypes" TEXT[],
    "region" TEXT[],
    "budgetMemo" TEXT,
    "schedule" TEXT,
    "scaleMemo" TEXT,
    "jobTypes" TEXT[],
    "headcount" INTEGER,
    "requiredCerts" TEXT[],
    "safetyConds" TEXT,
    "equipMaterial" TEXT,
    "contractType" "ContractType",
    "status" "WorkRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldOpsInterest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "feature" "FieldOpsFeature" NOT NULL,
    "props" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldOpsInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldLeaderProfile_userId_key" ON "FieldLeaderProfile"("userId");

-- CreateIndex
CREATE INDEX "FieldLeaderProfile_userId_idx" ON "FieldLeaderProfile"("userId");

-- CreateIndex
CREATE INDEX "TeamAvailability_teamId_idx" ON "TeamAvailability"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamAvailability_teamId_weekStart_key" ON "TeamAvailability"("teamId", "weekStart");

-- CreateIndex
CREATE INDEX "WorkRequest_requesterId_idx" ON "WorkRequest"("requesterId");

-- CreateIndex
CREATE INDEX "WorkRequest_status_idx" ON "WorkRequest"("status");

-- CreateIndex
CREATE INDEX "WorkRequest_industry_status_idx" ON "WorkRequest"("industry", "status");

-- CreateIndex
CREATE INDEX "FieldOpsInterest_userId_idx" ON "FieldOpsInterest"("userId");

-- CreateIndex
CREATE INDEX "FieldOpsInterest_feature_idx" ON "FieldOpsInterest"("feature");

-- AddForeignKey
ALTER TABLE "FieldLeaderProfile" ADD CONSTRAINT "FieldLeaderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAvailability" ADD CONSTRAINT "TeamAvailability_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRequest" ADD CONSTRAINT "WorkRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOpsInterest" ADD CONSTRAINT "FieldOpsInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
