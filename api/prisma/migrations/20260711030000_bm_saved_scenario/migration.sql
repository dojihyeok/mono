-- CreateTable
CREATE TABLE "BmSavedScenario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "linkedBm" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "enabledFeatures" TEXT[],
    "monthly" DOUBLE PRECISION NOT NULL,
    "arr" DOUBLE PRECISION NOT NULL,
    "assumptionStatus" TEXT NOT NULL,
    "assumptionVersion" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BmSavedScenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BmSavedScenario_linkedBm_idx" ON "BmSavedScenario"("linkedBm");
