import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { IndustryType } from '@prisma/client';

// 프로젝트/현장 운영자 프로필 — 캐노니컬 §3-2(5). 모든 필드 선택(부분 갱신 upsert).
export class OperatorProfileDto {
  // 소속 Company(OPERATOR) — 느슨한 참조
  @IsOptional()
  @IsString()
  companyId?: string;

  // 산업분야(복수)
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[];

  // 투입/담당 지역
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];

  // 유사 운영경험
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  similarExperience?: string[];

  // 보유 리더풀(느슨한 참조)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  leaderPoolIds?: string[];

  // 예산관리 메모
  @IsOptional()
  @IsString()
  budgetRangeMemo?: string;
}
