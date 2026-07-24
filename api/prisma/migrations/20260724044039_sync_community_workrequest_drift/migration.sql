-- AlterTable
ALTER TABLE "WorkRequest" ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "foreignAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interpreterProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredVisaTypes" "VisaType"[],
ALTER COLUMN "requesterId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "subChannel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "helps" INTEGER NOT NULL DEFAULT 0,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "ratings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityReport" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistWord" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityPost_channel_idx" ON "CommunityPost"("channel");

-- CreateIndex
CREATE INDEX "CommunityPost_authorId_idx" ON "CommunityPost"("authorId");

-- CreateIndex
CREATE INDEX "CommunityComment_postId_idx" ON "CommunityComment"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistWord_word_key" ON "BlacklistWord"("word");

-- AddForeignKey
ALTER TABLE "WorkRequest" ADD CONSTRAINT "WorkRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
