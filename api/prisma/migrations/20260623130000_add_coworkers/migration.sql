-- CreateTable
CREATE TABLE "Coworker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coworkerId" TEXT NOT NULL,
    "jobPostId" TEXT,
    "siteName" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "lastWorkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coworker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Coworker_userId_idx" ON "Coworker"("userId");

-- CreateIndex
CREATE INDEX "Coworker_coworkerId_idx" ON "Coworker"("coworkerId");

-- CreateIndex
CREATE UNIQUE INDEX "Coworker_userId_coworkerId_key" ON "Coworker"("userId", "coworkerId");

-- AddForeignKey
ALTER TABLE "Coworker" ADD CONSTRAINT "Coworker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coworker" ADD CONSTRAINT "Coworker_coworkerId_fkey" FOREIGN KEY ("coworkerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coworker" ADD CONSTRAINT "Coworker_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
