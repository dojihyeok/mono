-- CreateEnum
CREATE TYPE "LeadSegment" AS ENUM ('OPERATOR', 'PARTNER', 'FIELD_LEADER', 'EDUCATION', 'CLIENT');

-- CreateEnum
CREATE TYPE "LeadInterestBM" AS ENUM ('URGENT_JOB_POSTING', 'CANDIDATE_VIEW', 'TEAM_MATCHING', 'ATTENDANCE_REPORT', 'AI_GUIDE');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('COLD_EMAIL_SENT', 'REPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_DONE', 'POC_INTEREST');

-- CreateEnum
CREATE TYPE "PaymentIntent" AS ENUM ('NONE', 'CONSIDERING', 'BUDGETED', 'POC_READY');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "segment" "LeadSegment" NOT NULL,
    "contact" TEXT NOT NULL,
    "industry" TEXT,
    "region" TEXT,
    "interestBMs" "LeadInterestBM"[],
    "stage" "LeadStage" NOT NULL DEFAULT 'COLD_EMAIL_SENT',
    "paymentIntent" "PaymentIntent" NOT NULL DEFAULT 'NONE',
    "followUp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "followUpAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "role" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Lead_segment_idx" ON "Lead"("segment");

-- CreateIndex
CREATE INDEX "Interview_leadId_idx" ON "Interview"("leadId");

-- CreateIndex
CREATE INDEX "SurveyResponse_leadId_idx" ON "SurveyResponse"("leadId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

