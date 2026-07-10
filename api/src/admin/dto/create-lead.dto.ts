import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { LeadSegment, LeadInterestBM } from '@prisma/client';

// BM 검증 CRM — 콜드메일 대상 리드 신규 등록
export class CreateLeadDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsEnum(LeadSegment)
  segment!: LeadSegment;

  @IsString()
  @MinLength(1)
  contact!: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(LeadInterestBM, { each: true })
  interestBMs?: LeadInterestBM[];

  @IsOptional()
  @IsString()
  followUp?: string;
}
