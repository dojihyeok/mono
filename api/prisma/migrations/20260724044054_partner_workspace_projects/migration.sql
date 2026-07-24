-- CreateEnum
CREATE TYPE "PartnerProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PartnerProjectMemberRole" AS ENUM ('WORKER', 'MANAGER');

-- CreateEnum
CREATE TYPE "PartnerProjectMemberStatus" AS ENUM ('INVITED', 'CONFIRMED', 'DECLINED', 'REMOVED');

-- CreateTable
CREATE TABLE "PartnerProject" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteName" TEXT,
    "industry" "IndustryType",
    "jobTypes" TEXT[],
    "region" TEXT[],
    "requiredHeadcount" INTEGER,
    "startDate" TEXT,
    "endDate" TEXT,
    "status" "PartnerProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerProjectMember" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "jobType" TEXT,
    "role" "PartnerProjectMemberRole" NOT NULL DEFAULT 'WORKER',
    "status" "PartnerProjectMemberStatus" NOT NULL DEFAULT 'INVITED',
    "joinedAt" TEXT,
    "leftAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerProject_companyId_idx" ON "PartnerProject"("companyId");

-- CreateIndex
CREATE INDEX "PartnerProject_status_idx" ON "PartnerProject"("status");

-- CreateIndex
CREATE INDEX "PartnerProjectMember_projectId_idx" ON "PartnerProjectMember"("projectId");

-- CreateIndex
CREATE INDEX "PartnerProjectMember_userId_idx" ON "PartnerProjectMember"("userId");

-- CreateIndex
CREATE INDEX "PartnerProjectMember_status_idx" ON "PartnerProjectMember"("status");

-- AddForeignKey
ALTER TABLE "PartnerProject" ADD CONSTRAINT "PartnerProject_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerProjectMember" ADD CONSTRAINT "PartnerProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "PartnerProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerProjectMember" ADD CONSTRAINT "PartnerProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
