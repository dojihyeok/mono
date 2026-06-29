import { IsOptional, IsString } from 'class-validator';

// 정산 목록 필터 — 쿼리스트링(@Query).
export class QuerySettlementDto {
  @IsOptional()
  @IsString()
  workerId?: string; // 기술자 기준

  @IsOptional()
  @IsString()
  companyId?: string; // 기업 기준
}
