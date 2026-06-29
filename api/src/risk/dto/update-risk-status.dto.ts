import { IsEnum } from 'class-validator';
import { RiskReportStatus } from '@prisma/client';

// 리스크 신고 상태 변경 — OPEN/IN_REVIEW/RESOLVED/DISMISSED.
export class UpdateRiskStatusDto {
  @IsEnum(RiskReportStatus)
  status!: RiskReportStatus;
}
