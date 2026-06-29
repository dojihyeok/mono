import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IndustryType, WorkRequestStatus } from '@prisma/client';

// 현장작업요청 목록 필터 — 쿼리스트링(@Query). 전역 ValidationPipe(transform)로 형변환.
export class QueryWorkRequestDto {
  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType; // 산업유형 일치

  @IsOptional()
  @IsString()
  region?: string; // 단일 지역 — region 배열에 has 매칭

  @IsOptional()
  @IsString()
  workType?: string; // 단일 작업유형 — workTypes 배열에 has 매칭

  @IsOptional()
  @IsEnum(WorkRequestStatus)
  status?: WorkRequestStatus; // 상태 일치

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number; // 최대 건수(기본 50)
}
