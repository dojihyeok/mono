import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BmDecision } from '@prisma/client';

// BM 검증(v1.2) — 의사결정 로그(KEEP/CHANGE/HOLD/KILL) 신규 기록
export class CreateBmDecisionLogDto {
  @IsOptional()
  @IsString()
  hypothesisId?: string;

  @IsString()
  @MinLength(1)
  bmName!: string;

  @IsEnum(BmDecision)
  decision!: BmDecision;

  @IsString()
  @MinLength(1)
  rationale!: string;

  @IsString()
  @MinLength(1)
  approver!: string;

  @IsOptional()
  @IsDateString()
  nextReviewAt?: string;
}
