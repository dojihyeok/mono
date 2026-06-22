/*
  Warnings:

  - The `jobType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `region` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobType",
ADD COLUMN     "jobType" TEXT[],
DROP COLUMN "region",
ADD COLUMN     "region" TEXT[];
