-- CreateEnum
CREATE TYPE "CandidateType" AS ENUM ('PERFORMER_COMPANY', 'FIELD_LEADER', 'TEAM');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('RECOMMENDED', 'SHORTLISTED', 'CONTACTED', 'REJECTED', 'SELECTED');

-- CreateEnum
CREATE TYPE "RateeType" AS ENUM ('WORKER', 'FIELD_LEADER', 'PERFORMER_COMPANY', 'PROJECT_OPERATOR', 'TEAM', 'SITE_ENVIRONMENT');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "defectMemo" TEXT,
ADD COLUMN     "industries" "IndustryType"[],
ADD COLUMN     "rehireRate" DOUBLE PRECISION,
ADD COLUMN     "safetyRate" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "WorkerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "industries" "IndustryType"[],
    "preferredWorkTypes" TEXT[],
    "similarWorkExperience" TEXT[],
    "contactHours" TEXT,
    "introduction" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "proficient" BOOLEAN NOT NULL DEFAULT false,
    "yearsUsed" INTEGER,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectOperator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "industries" "IndustryType"[],
    "regions" TEXT[],
    "similarExperience" TEXT[],
    "leaderPoolIds" TEXT[],
    "budgetRangeMemo" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkRecord" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "leaderUserId" TEXT,
    "industry" "IndustryType" NOT NULL,
    "title" TEXT NOT NULL,
    "siteName" TEXT,
    "workTypes" TEXT[],
    "period" TEXT,
    "scaleMemo" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkRequestCandidate" (
    "id" TEXT NOT NULL,
    "workRequestId" TEXT NOT NULL,
    "candidateType" "CandidateType" NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'RECOMMENDED',
    "score" DOUBLE PRECISION,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkRequestCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "raterUserId" TEXT NOT NULL,
    "rateeType" "RateeType" NOT NULL,
    "rateeId" TEXT NOT NULL,
    "workRequestId" TEXT,
    "scheduleAdherence" INTEGER,
    "workQuality" INTEGER,
    "communication" INTEGER,
    "safetyManagement" INTEGER,
    "costTrust" INTEGER,
    "rehireIntent" INTEGER,
    "siteEnvironment" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustScore" (
    "id" TEXT NOT NULL,
    "subjectType" "RateeType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "breakdown" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiLeaderInterest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "industry" "IndustryType",
    "conditions" JSONB,
    "repeatPattern" JSONB,
    "candidateTeamIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiLeaderInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerProfile_userId_key" ON "WorkerProfile"("userId");

-- CreateIndex
CREATE INDEX "WorkerProfile_userId_idx" ON "WorkerProfile"("userId");

-- CreateIndex
CREATE INDEX "EquipmentHistory_userId_idx" ON "EquipmentHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectOperator_userId_key" ON "ProjectOperator"("userId");

-- CreateIndex
CREATE INDEX "ProjectOperator_userId_idx" ON "ProjectOperator"("userId");

-- CreateIndex
CREATE INDEX "ProjectOperator_companyId_idx" ON "ProjectOperator"("companyId");

-- CreateIndex
CREATE INDEX "WorkRecord_companyId_idx" ON "WorkRecord"("companyId");

-- CreateIndex
CREATE INDEX "WorkRecord_leaderUserId_idx" ON "WorkRecord"("leaderUserId");

-- CreateIndex
CREATE INDEX "WorkRecord_industry_idx" ON "WorkRecord"("industry");

-- CreateIndex
CREATE INDEX "WorkRequestCandidate_workRequestId_status_idx" ON "WorkRequestCandidate"("workRequestId", "status");

-- CreateIndex
CREATE INDEX "WorkRequestCandidate_candidateType_candidateId_idx" ON "WorkRequestCandidate"("candidateType", "candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkRequestCandidate_workRequestId_candidateType_candidateI_key" ON "WorkRequestCandidate"("workRequestId", "candidateType", "candidateId");

-- CreateIndex
CREATE INDEX "Review_rateeType_rateeId_idx" ON "Review"("rateeType", "rateeId");

-- CreateIndex
CREATE INDEX "Review_raterUserId_idx" ON "Review"("raterUserId");

-- CreateIndex
CREATE INDEX "Review_workRequestId_idx" ON "Review"("workRequestId");

-- CreateIndex
CREATE INDEX "TrustScore_subjectType_score_idx" ON "TrustScore"("subjectType", "score");

-- CreateIndex
CREATE UNIQUE INDEX "TrustScore_subjectType_subjectId_key" ON "TrustScore"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "AiLeaderInterest_userId_idx" ON "AiLeaderInterest"("userId");

-- AddForeignKey
ALTER TABLE "WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOperator" ADD CONSTRAINT "ProjectOperator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOperator" ADD CONSTRAINT "ProjectOperator_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRecord" ADD CONSTRAINT "WorkRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRecord" ADD CONSTRAINT "WorkRecord_leaderUserId_fkey" FOREIGN KEY ("leaderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRequestCandidate" ADD CONSTRAINT "WorkRequestCandidate_workRequestId_fkey" FOREIGN KEY ("workRequestId") REFERENCES "WorkRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_raterUserId_fkey" FOREIGN KEY ("raterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_workRequestId_fkey" FOREIGN KEY ("workRequestId") REFERENCES "WorkRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLeaderInterest" ADD CONSTRAINT "AiLeaderInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
