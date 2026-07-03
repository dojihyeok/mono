import {
  IsBoolean,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  ContractType,
  IndustryType,
  WorkRequestStatus,
  VisaType,
} from '@prisma/client';

// 현장작업요청 수정 — 모든 필드 선택. status로 상태 전이 허용.
// requesterId(작성자)는 변경 불가 — 화이트리스트에서 제외.
export class UpdateWorkRequestDto {
  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType; // 산업유형

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

  @IsOptional()
  @IsEnum(WorkRequestStatus)
  status?: WorkRequestStatus; // 상태 전이(DRAFT→OPEN→MATCHING→…)

  @IsOptional()
  @IsBoolean()
  foreignAllowed?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(VisaType, { each: true })
  requiredVisaTypes?: VisaType[];

  @IsOptional()
  @IsBoolean()
  interpreterProvided?: boolean;
}
