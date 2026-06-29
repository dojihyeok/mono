import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PartnerReferralKind } from '@prisma/client';

// 행정·노무 파트너 연계 요청 생성 — status 기본 REQUESTED. PDF §2·§6.
export class CreateReferralDto {
  @IsString()
  @MinLength(1)
  requesterId!: string; // 기술자 또는 기업

  @IsEnum(PartnerReferralKind)
  kind!: PartnerReferralKind; // VISA/LABOR/SETTLEMENT/EDUCATION/INSURANCE

  @IsOptional()
  @IsString()
  note?: string;
}
