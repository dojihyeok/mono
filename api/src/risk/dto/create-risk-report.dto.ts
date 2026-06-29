import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RiskReportKind } from '@prisma/client';

// 리스크 신고 생성 — status 기본 OPEN. PDF §8-4.
export class CreateRiskReportDto {
  @IsString()
  @MinLength(1)
  reporterId!: string; // 신고자

  @IsOptional()
  @IsString()
  subjectId?: string; // 신고 대상(사용자/기업/현장)

  @IsEnum(RiskReportKind)
  kind!: RiskReportKind; // WAGE_UNPAID/SAFETY_ACCIDENT/LANGUAGE_HAZARD/ABUSE

  @IsOptional()
  @IsString()
  detail?: string;
}
