-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('WORKER', 'FOREMAN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'WORKER';
