import { IsDateString, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { BmEvidenceType, BmHypothesisStatus } from '@prisma/client';

// BM 검증(v1.2) — 수익모델 가설 갱신
export class UpdateBmHypothesisDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  valueProposition?: string;

  @IsOptional()
  @IsString()
  pricingHypothesis?: string;

  @IsOptional()
  @IsString()
  revenueType?: string;

  @IsOptional()
  @IsString()
  currentEvidence?: string;

  @IsOptional()
  @IsEnum(BmEvidenceType)
  evidenceLevel?: BmEvidenceType;

  @IsOptional()
  @IsString()
  nextExperiment?: string;

  @IsOptional()
  @IsString()
  successCriteria?: string;

  @IsOptional()
  @IsString()
  failureCriteria?: string;

  @IsOptional()
  @IsString()
  owner?: string;

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
