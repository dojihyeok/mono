-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobSite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dailyWage" INTEGER NOT NULL,
    "specialty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Construction',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "hasCarpool" BOOLEAN NOT NULL DEFAULT false,
    "carpoolLocation" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_JobSite" ("createdAt", "dailyWage", "date", "description", "id", "location", "specialty", "status", "title") SELECT "createdAt", "dailyWage", "date", "description", "id", "location", "specialty", "status", "title" FROM "JobSite";
DROP TABLE "JobSite";
ALTER TABLE "new_JobSite" RENAME TO "JobSite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
