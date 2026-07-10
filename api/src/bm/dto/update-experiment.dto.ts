import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { BmExperimentStage } from '@prisma/client';

// BM 검증(v1.2) — 실험 진행상황·결과 갱신
export class UpdateBmExperimentDto {
  @IsOptional()
  @IsString()
  title?: string;

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
