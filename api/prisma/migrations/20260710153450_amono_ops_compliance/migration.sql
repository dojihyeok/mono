-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('READY', 'REPORT_REQUIRED', 'LICENSE_GATE', 'PARTNER_REQUIRED', 'LEGAL_REVIEW', 'BLOCKED');

-- CreateEnum
CREATE TYPE "FieldPassEventResult" AS ENUM ('SUCCESS', 'FAILED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
CREATE TABLE "ComplianceItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'LEGAL_REVIEW',
    "authority" TEXT,
    "appliedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "registrationNo" TEXT,
    "renewalAt" TIMESTAMP(3),
    "evidenceDoc" TEXT,
    "owner" TEXT,
    "legalOpinion" TEXT,
    "linkedFeatureFlag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldPassSite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gates" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldPassSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldPassAuthEvent" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "gateName" TEXT,
    "authMethod" TEXT NOT NULL,
    "result" "FieldPassEventResult" NOT NULL,
    "reason" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldPassAuthEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationsAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationsAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ComplianceItem_status_idx" ON "ComplianceItem"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE INDEX "FieldPassAuthEvent_siteId_idx" ON "FieldPassAuthEvent"("siteId");

-- CreateIndex
CREATE INDEX "FieldPassAuthEvent_result_idx" ON "FieldPassAuthEvent"("result");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "OperationsAlert_status_idx" ON "OperationsAlert"("status");

-- AddForeignKey
ALTER TABLE "FieldPassAuthEvent" ADD CONSTRAINT "FieldPassAuthEvent_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "FieldPassSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
