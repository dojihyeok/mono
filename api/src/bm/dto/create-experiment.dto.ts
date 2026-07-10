import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BmExperimentStage } from '@prisma/client';

// BM 검증(v1.2) — 가설별 실험(PoC/테스트) 신규 등록
export class CreateBmExperimentDto {
  @IsString()
  @MinLength(1)
  hypothesisId!: string;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  targetCustomer?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @IsOptional()
  @IsString()
  sampleTarget?: string;

  @IsOptional()
  @IsString()
  successCriteria?: string;

  @IsOptional()
  @IsString()
  cost?: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  learning?: string;

  @IsOptional()
  @IsString()
  nextDecision?: string;

  @IsOptional()
  @IsEnum(BmExperimentStage)
  stage?: BmExperimentStage;
}
