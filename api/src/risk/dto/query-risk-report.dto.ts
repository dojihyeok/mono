import { IsEnum, IsOptional } from 'class-validator';
import { RiskReportKind, RiskReportStatus } from '@prisma/client';

// 리스크 신고 목록 필터 — 쿼리스트링(@Query).
export class QueryRiskReportDto {
  @IsOptional()
  @IsEnum(RiskReportStatus)
  status?: RiskReportStatus;

  @IsOptional()
  @IsEnum(RiskReportKind)
  kind?: RiskReportKind;
}
