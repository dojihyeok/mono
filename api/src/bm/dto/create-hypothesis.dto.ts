import { IsDateString, IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { BmEvidenceType, BmHypothesisStatus } from '@prisma/client';

// BM 검증(v1.2) — 수익모델 가설 신규 등록
export class CreateBmHypothesisDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  customerSegment!: string;

  @IsString()
  @MinLength(1)
  problem!: string;

  @IsString()
  @MinLength(1)
  valueProposition!: string;

  @IsString()
  @MinLength(1)
  pricingHypothesis!: string;

  @IsString()
  @MinLength(1)
  revenueType!: string;

  @IsString()
  @MinLength(1)
  currentEvidence!: string;

  @IsEnum(BmEvidenceType)
  evidenceLevel!: BmEvidenceType;

  @IsString()
  @MinLength(1)
  nextExperiment!: string;

  @IsString()
  @MinLength(1)
  successCriteria!: string;

  @IsOptional()
  @IsString()
  failureCriteria?: string;

  @IsString()
  @MinLength(1)
  owner!: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(BmHypothesisStatus)
  status?: BmHypothesisStatus;

  @IsOptional()
  @IsObject()
  unitEconomics?: Record<string, unknown>;
}
