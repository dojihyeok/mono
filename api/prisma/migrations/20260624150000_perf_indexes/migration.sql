-- DropIndex
DROP INDEX "Coworker_userId_idx";

-- DropIndex
DROP INDEX "JobApplication_jobPostId_idx";

-- DropIndex
DROP INDEX "JobApplication_userId_idx";

-- CreateIndex
CREATE INDEX "Coworker_userId_lastWorkedAt_idx" ON "Coworker"("userId", "lastWorkedAt");

-- CreateIndex
CREATE INDEX "JobApplication_userId_status_idx" ON "JobApplication"("userId", "status");

-- CreateIndex
CREATE INDEX "JobApplication_jobPostId_status_idx" ON "JobApplication"("jobPostId", "status");
