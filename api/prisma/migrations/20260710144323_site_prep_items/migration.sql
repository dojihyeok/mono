-- CreateEnum
CREATE TYPE "SitePrepKind" AS ENUM ('ID_CARD', 'SAFETY_EDU', 'ELEC_CARD', 'BANK_ACC', 'MED_CHECK', 'GATE_CARD', 'SAFETY_GEAR');

-- CreateEnum
CREATE TYPE "SitePrepStatus" AS ENUM ('SUBMITTED', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "SitePrepItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SitePrepStatus" NOT NULL DEFAULT 'SUBMITTED',
    "kind" "SitePrepKind" NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePrepItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SitePrepItem_userId_idx" ON "SitePrepItem"("userId");

-- CreateIndex
CREATE INDEX "SitePrepItem_status_idx" ON "SitePrepItem"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SitePrepItem_userId_kind_key" ON "SitePrepItem"("userId", "kind");

-- AddForeignKey
ALTER TABLE "SitePrepItem" ADD CONSTRAINT "SitePrepItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
