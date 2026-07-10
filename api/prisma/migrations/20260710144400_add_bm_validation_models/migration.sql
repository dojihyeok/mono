-- CreateEnum
CREATE TYPE "BmEvidenceType" AS ENUM ('PAID', 'REPEAT', 'PILOT', 'LOI', 'INTERVIEW', 'SURVEY', 'HYPOTHESIS', 'TECH_REVIEW', 'POC_PLANNED', 'PARTNERED');

-- CreateEnum
CREATE TYPE "BmHypothesisStatus" AS ENUM ('P0_NOW', 'P1_NEXT', 'P2_LATER', 'HOLD', 'KILL');

-- CreateEnum
CREATE TYPE "BmExperimentStage" AS ENUM ('BACKLOG', 'READY', 'RUNNING', 'ANALYZING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BmDecision" AS ENUM ('KEEP', 'CHANGE', 'HOLD', 'KILL');

-- CreateTable
CREATE TABLE "BmHypothesis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "customerSegment" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "valueProposition" TEXT NOT NULL,
    "pricingHypothesis" TEXT NOT NULL,
    "revenueType" TEXT NOT NULL,
    "currentEvidence" TEXT NOT NULL,
    "evidenceLevel" "BmEvidenceType" NOT NULL,
    "nextExperiment" TEXT NOT NULL,
    "successCriteria" TEXT NOT NULL,
    "failureCriteria" TEXT,
    "owner" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "BmHypothesisStatus" NOT NULL DEFAULT 'P1_NEXT',
    "unitEconomics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BmHypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BmExperiment" (
    "id" TEXT NOT NULL,
    "hypothesisId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetCustomer" TEXT,
    "method" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "sampleTarget" TEXT,
    "successCriteria" TEXT,
    "cost" TEXT,
    "result" TEXT,
    "learning" TEXT,
    "nextDecision" TEXT,
    "stage" "BmExperimentStage" NOT NULL DEFAULT 'BACKLOG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BmExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BmDecisionLog" (
    "id" TEXT NOT NULL,
    "hypothesisId" TEXT,
    "bmName" TEXT NOT NULL,
    "decision" "BmDecision" NOT NULL,
    "rationale" TEXT NOT NULL,
    "approver" TEXT NOT NULL,
    "nextReviewAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BmDecisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BmNextAction" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "hypothesisId" TEXT,
    "successCriteria" TEXT,
    "blocker" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BmNextAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BmRevenueObjective" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "targetRevenue" TEXT NOT NULL,
    "keyBm" TEXT NOT NULL,
    "successCriteria" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BmRevenueObjective_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BmHypothesis_status_idx" ON "BmHypothesis"("status");

-- CreateIndex
CREATE INDEX "BmExperiment_hypothesisId_idx" ON "BmExperiment"("hypothesisId");

-- CreateIndex
CREATE INDEX "BmExperiment_stage_idx" ON "BmExperiment"("stage");

-- CreateIndex
CREATE INDEX "BmDecisionLog_hypothesisId_idx" ON "BmDecisionLog"("hypothesisId");

-- CreateIndex
CREATE INDEX "BmNextAction_hypothesisId_idx" ON "BmNextAction"("hypothesisId");

-- AddForeignKey
ALTER TABLE "BmExperiment" ADD CONSTRAINT "BmExperiment_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "BmHypothesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BmDecisionLog" ADD CONSTRAINT "BmDecisionLog_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "BmHypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BmNextAction" ADD CONSTRAINT "BmNextAction_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "BmHypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
