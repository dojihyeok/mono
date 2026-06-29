-- 캐노니컬 §0-3 IndustryType(11), §0-2 CompanyKind + 기존 테이블 비파괴 컬럼 추가. (dev-plan §3-4 #4·#5)

-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('INTERIOR_REMODELING', 'CONSTRUCTION_FACILITY', 'SHIPBUILDING', 'PLANT', 'MANUFACTURING_FACILITY', 'LOGISTICS_EQUIPMENT', 'ENERGY_FACILITY', 'PORT_AIRPORT', 'PUBLIC_INFRA', 'DISASTER_RECOVERY', 'SPACE_ROBOTICS', 'ETC');

-- CreateEnum
CREATE TYPE "CompanyKind" AS ENUM ('PERFORMER', 'OPERATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "industries" "IndustryType"[];

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "companyKind" "CompanyKind" NOT NULL DEFAULT 'PERFORMER';
