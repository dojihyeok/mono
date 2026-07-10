import { IsBoolean, IsOptional, IsString } from 'class-validator';

// /amono 관리자 운영·컴플라이언스(v1.0) — 기능 플래그 토글
export class UpdateFeatureFlagDto {
  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
