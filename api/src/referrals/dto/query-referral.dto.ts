import { IsEnum, IsOptional } from 'class-validator';
import { PartnerReferralKind, PartnerReferralStatus } from '@prisma/client';

// 파트너 연계 큐 목록 필터 — 쿼리스트링(@Query).
export class QueryReferralDto {
  @IsOptional()
  @IsEnum(PartnerReferralStatus)
  status?: PartnerReferralStatus;

  @IsOptional()
  @IsEnum(PartnerReferralKind)
  kind?: PartnerReferralKind;
}
