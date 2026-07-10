import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

// /amono 관리자 운영·컴플라이언스(v1.0) — Field Pass 현장 신규 등록
export class CreateFieldPassSiteDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  gates?: unknown; // [{name, authMethod}][]

  @IsOptional()
  @IsIn(['PLANNED', 'PILOT', 'LIVE'])
  status?: string;
}
