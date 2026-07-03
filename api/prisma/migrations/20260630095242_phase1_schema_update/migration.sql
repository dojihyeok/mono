-- CreateEnum
CREATE TYPE "ConsultStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CheckinType" AS ENUM ('GATHERING', 'RIDE', 'ARRIVAL', 'START', 'FINISH');

-- CreateTable
CREATE TABLE "SavedJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultRequest" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "status" "ConsultStatus" NOT NULL DEFAULT 'PENDING',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldCheckin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CheckinType" NOT NULL,
    "workDate" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPost" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isNotice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedJob_userId_idx" ON "SavedJob"("userId");

-- CreateIndex
CREATE INDEX "SavedJob_jobPostId_idx" ON "SavedJob"("jobPostId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_userId_jobPostId_key" ON "SavedJob"("userId", "jobPostId");

-- CreateIndex
CREATE INDEX "ConsultRequest_companyId_idx" ON "ConsultRequest"("companyId");

-- CreateIndex
CREATE INDEX "ConsultRequest_targetUserId_idx" ON "ConsultRequest"("targetUserId");

-- CreateIndex
CREATE INDEX "FieldCheckin_userId_workDate_idx" ON "FieldCheckin"("userId", "workDate");

-- CreateIndex
CREATE INDEX "TeamPost_teamId_idx" ON "TeamPost"("teamId");

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultRequest" ADD CONSTRAINT "ConsultRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultRequest" ADD CONSTRAINT "ConsultRequest_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldCheckin" ADD CONSTRAINT "FieldCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPost" ADD CONSTRAINT "TeamPost_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPost" ADD CONSTRAINT "TeamPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
