import { IsOptional, IsString, MinLength } from 'class-validator';

// BM 검증(v1.2) — 기간별 매출 목표 신규 등록
export class CreateBmRevenueObjectiveDto {
  @IsString()
  @MinLength(1)
  period!: string; // 예: "2026 Q3"

  @IsString()
  @MinLength(1)
  targetRevenue!: string;

  @IsString()
  @MinLength(1)
  keyBm!: string;

  @IsString()
  @MinLength(1)
  successCriteria!: string;

  @IsString()
  @MinLength(1)
  owner!: string;

  @IsOptional()
  @IsString()
  status?: string;
}
