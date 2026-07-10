import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ComplianceStatus } from '@prisma/client';

// /amono 관리자 운영·컴플라이언스(v1.0) — 규제·라이선스 항목 신규 등록
export class CreateComplianceItemDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @IsOptional()
  @IsString()
  authority?: string;

  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  registrationNo?: string;

  @IsOptional()
  @IsDateString()
  renewalAt?: string;

  @IsOptional()
  @IsString()
  evidenceDoc?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  legalOpinion?: string;

  @IsOptional()
  @IsString()
  linkedFeatureFlag?: string;
}
