-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('INQUIRY', 'REVIEWING', 'PARTNER_CANDIDATE', 'POSTED', 'POC');

-- CreateEnum
CREATE TYPE "JobPostStatus" AS ENUM ('DRAFT', 'PENDING', 'OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "industry" TEXT,
    "region" TEXT[],
    "status" "CompanyStatus" NOT NULL DEFAULT 'INQUIRY',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPost" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jobType" TEXT[],
    "headcount" INTEGER,
    "careerBand" "CareerBand",
    "certs" TEXT[],
    "region" TEXT[],
    "period" TEXT,
    "conditions" TEXT,
    "status" "JobPostStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedWorker" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedWorker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_status_idx" ON "Company"("status");

-- CreateIndex
CREATE INDEX "JobPost_companyId_idx" ON "JobPost"("companyId");

-- CreateIndex
CREATE INDEX "JobPost_status_idx" ON "JobPost"("status");

-- CreateIndex
CREATE INDEX "SavedWorker_companyId_idx" ON "SavedWorker"("companyId");

-- CreateIndex
CREATE INDEX "SavedWorker_userId_idx" ON "SavedWorker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedWorker_companyId_userId_key" ON "SavedWorker"("companyId", "userId");

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWorker" ADD CONSTRAINT "SavedWorker_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWorker" ADD CONSTRAINT "SavedWorker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

