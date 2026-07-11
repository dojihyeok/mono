-- CreateEnum
CREATE TYPE "JobPostSource" AS ENUM ('PARTNER', 'CRAWLED_CAFE', 'CRAWLED_BAND');

-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "source" "JobPostSource" NOT NULL DEFAULT 'PARTNER',
ADD COLUMN     "sourcePostedAt" TIMESTAMP(3),
ADD COLUMN     "sourceRawText" TEXT,
ADD COLUMN     "sourceUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "JobPost_sourceUrl_key" ON "JobPost"("sourceUrl");

