import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { CompanyKind, IndustryType } from '@prisma/client';

// 기업 신청/등록 (DB: Company, 초기 status INQUIRY)
export class CreateCompanyDto {
  @IsString()
  @MinLength(1)
  name!: string; // 회사명

  @IsString()
  @MinLength(1)
  contactName!: string; // 담당자

  @IsString()
  @MinLength(1)
  contactPhone!: string; // 연락처

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  industry?: string; // 업종

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  region?: string[]; // 현장 지역(복수)

  // 수행기업/운영자 구분 — 미지정 시 DB 기본값 PERFORMER (§3-3)
  @IsOptional()
  @IsEnum(CompanyKind)
  companyKind?: CompanyKind;

  // 산업분야(복수) — 캐노니컬 enum
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[];

  // 안전이수율(0~1)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  safetyRate?: number;

  // 재의뢰율(0~1)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  rehireRate?: number;

  @IsOptional()
  @IsString()
  memo?: string;
}
