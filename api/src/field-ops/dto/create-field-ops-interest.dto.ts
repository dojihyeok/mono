import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { FieldOpsFeature } from '@prisma/client';

// Field Ops 관심 등록 (DB: FieldOpsInterest). 익명 허용(userId 없을 수 있음).
export class CreateFieldOpsInterestDto {
  // 관심 기능 7종 중 1 (장비공구·스마트계측·소모자재·패키지·식사숙소·교육·보험)
  @IsEnum(FieldOpsFeature)
  feature!: FieldOpsFeature;

  // 로그인 사용자면 연결, 비로그인(익명)이면 생략
  @IsOptional()
  @IsString()
  userId?: string;

  // 산업/지역 등 맥락 — Prisma Json 컬럼에 그대로 저장
  @IsOptional()
  @IsObject()
  props?: Record<string, unknown>;
}
