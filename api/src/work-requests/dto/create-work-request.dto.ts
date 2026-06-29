import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ContractType, IndustryType } from '@prisma/client';

// 현장작업요청 생성 (DB: WorkRequest, 초기 status DRAFT=작성 중)
// status는 받지 않음 — 상태 전이는 PATCH에서만 허용.
export class CreateWorkRequestDto {
  @IsString()
  @MinLength(1)
  requesterId!: string; // 작성자(CUSTOMER 또는 PROJECT_OPERATOR)

  @IsEnum(IndustryType)
  industry!: IndustryType; // 산업유형(필수)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workTypes?: string[]; // 작업유형(복수)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  region?: string[]; // 지역(복수)

  @IsOptional()
  @IsString()
  budgetMemo?: string; // 예산

  @IsOptional()
  @IsString()
  schedule?: string; // 일정

  @IsOptional()
  @IsString()
  scaleMemo?: string; // 규모

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobTypes?: string[]; // 필요 직군(복수)

  @IsOptional()
  @IsInt()
  @Min(1)
  headcount?: number; // 필요 인원

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredCerts?: string[]; // 필요 자격(복수)

  @IsOptional()
  @IsString()
  safetyConds?: string; // 안전 조건

  @IsOptional()
  @IsString()
  equipMaterial?: string; // 장비/자재

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType; // 계약방식
}
