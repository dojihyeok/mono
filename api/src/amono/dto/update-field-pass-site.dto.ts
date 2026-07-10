import { IsIn, IsOptional, IsString } from 'class-validator';

// /amono 관리자 운영·컴플라이언스(v1.0) — Field Pass 현장 갱신
export class UpdateFieldPassSiteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  gates?: unknown;

  @IsOptional()
  @IsIn(['PLANNED', 'PILOT', 'LIVE'])
  status?: string;
}
