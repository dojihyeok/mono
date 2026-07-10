import { IsOptional, IsString } from 'class-validator';

// BM 검증(v1.2) — 매출 목표 갱신
export class UpdateBmRevenueObjectiveDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsString()
  targetRevenue?: string;

  @IsOptional()
  @IsString()
  keyBm?: string;

  @IsOptional()
  @IsString()
  successCriteria?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
