-- CreateEnum
CREATE TYPE "Residency" AS ENUM ('DOMESTIC', 'OVERSEAS');

-- CreateEnum
CREATE TYPE "VisaType" AS ENUM ('E9', 'E7', 'E74', 'H2', 'D2', 'D4', 'F2', 'F4', 'F5', 'F6', 'ETC');

-- CreateEnum
CREATE TYPE "VisaDocStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "KoreanLevel" AS ENUM ('NONE', 'BASIC', 'INTERMEDIATE', 'FLUENT', 'NATIVE');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('PASSPORT', 'ARC', 'CONTRACT', 'VISA', 'TRAINING_CERT', 'OTHER');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'PAID', 'DISPUTED');

-- CreateEnum
CREATE TYPE "SettlementItemKind" AS ENUM ('BASE_WAGE', 'OVERTIME', 'ALLOWANCE', 'MEAL', 'LODGING', 'TRANSPORT', 'EDUCATION', 'INSURANCE', 'REMITTANCE');

-- CreateEnum
CREATE TYPE "TrainingKind" AS ENUM ('SAFETY', 'JOB', 'KOREAN');

-- CreateEnum
CREATE TYPE "RiskReportKind" AS ENUM ('WAGE_UNPAID', 'SAFETY_ACCIDENT', 'LANGUAGE_HAZARD', 'ABUSE');

-- CreateEnum
CREATE TYPE "RiskReportStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "PartnerReferralKind" AS ENUM ('VISA', 'LABOR', 'SETTLEMENT', 'EDUCATION', 'INSURANCE');

-- CreateEnum
CREATE TYPE "PartnerReferralStatus" AS ENUM ('REQUESTED', 'MATCHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportedLang" AS ENUM ('KO', 'EN', 'VI', 'TH', 'ID', 'UZ');

-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "foreignAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interpreterProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredVisaTypes" "VisaType"[];

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "collaboration" INTEGER;

-- AlterTable
ALTER TABLE "WorkerProfile" ADD COLUMN     "desiredEntryDate" TIMESTAMP(3),
ADD COLUMN     "glossaryComprehension" INTEGER,
ADD COLUMN     "interpreterNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "koreanLevel" "KoreanLevel",
ADD COLUMN     "languages" "SupportedLang"[],
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "residency" "Residency";

-- CreateTable
CREATE TABLE "VisaStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "visaType" "VisaType" NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "renewalDueDate" TIMESTAMP(3),
    "workScope" TEXT,
    "workplaceChangeable" BOOLEAN NOT NULL DEFAULT false,
    "arcNumber" TEXT,
    "status" "VisaDocStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "DocumentKind" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "VisaDocStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "koTerm" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "industry" "IndustryType",
    "iconUrl" TEXT,
    "isSafety" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTranslation" (
    "id" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "lang" "SupportedLang" NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "GlossaryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "companyId" TEXT,
    "workRequestId" TEXT,
    "period" TEXT NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementItem" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "kind" "SettlementItemKind" NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "SettlementItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "TrainingKind" NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT,
    "completedAt" TIMESTAMP(3),
    "certUrl" TEXT,

    CONSTRAINT "TrainingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerReferral" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "kind" "PartnerReferralKind" NOT NULL,
    "status" "PartnerReferralStatus" NOT NULL DEFAULT 'REQUESTED',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskReport" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "subjectId" TEXT,
    "kind" "RiskReportKind" NOT NULL,
    "status" "RiskReportStatus" NOT NULL DEFAULT 'OPEN',
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisaStatus_userId_idx" ON "VisaStatus"("userId");

-- CreateIndex
CREATE INDEX "VisaStatus_expiryDate_idx" ON "VisaStatus"("expiryDate");

-- CreateIndex
CREATE INDEX "DocumentRecord_userId_kind_idx" ON "DocumentRecord"("userId", "kind");

-- CreateIndex
CREATE INDEX "GlossaryTerm_category_industry_idx" ON "GlossaryTerm"("category", "industry");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTranslation_termId_lang_key" ON "GlossaryTranslation"("termId", "lang");

-- CreateIndex
CREATE INDEX "Settlement_workerId_idx" ON "Settlement"("workerId");

-- CreateIndex
CREATE INDEX "Settlement_companyId_idx" ON "Settlement"("companyId");

-- CreateIndex
CREATE INDEX "TrainingRecord_userId_kind_idx" ON "TrainingRecord"("userId", "kind");

-- CreateIndex
CREATE INDEX "PartnerReferral_status_idx" ON "PartnerReferral"("status");

-- CreateIndex
CREATE INDEX "RiskReport_status_kind_idx" ON "RiskReport"("status", "kind");

-- AddForeignKey
ALTER TABLE "VisaStatus" ADD CONSTRAINT "VisaStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecord" ADD CONSTRAINT "DocumentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryTranslation" ADD CONSTRAINT "GlossaryTranslation_termId_fkey" FOREIGN KEY ("termId") REFERENCES "GlossaryTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementItem" ADD CONSTRAINT "SettlementItem_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
