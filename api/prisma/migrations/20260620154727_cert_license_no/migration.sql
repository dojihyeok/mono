/*
  Warnings:

  - Added the required column `licenseNo` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "licenseNo" TEXT NOT NULL;
