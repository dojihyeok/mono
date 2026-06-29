import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IndustryType } from '@prisma/client';

// 현장리더 프로필 — 캐노니컬 §3-2(3). 모든 필드 선택(부분 갱신 upsert).
export class FieldLeaderProfileDto {
  // 주요 직군
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  primaryJobTypes?: string[];

  // 관리 가능 팀 규모
  @IsOptional()
  @IsInt()
  @Min(0)
  manageableTeamSize?: number;

  // 주요 작업분야
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mainWorkFields?: string[];

  // 산업분야(복수)
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[];

  // 투입 가능 지역
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];

  // 협력 수행기업(느슨한 참조)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  partnerCompanyIds?: string[];

  // 연락 가능 시간
  @IsOptional()
  @IsString()
  contactHours?: string;
}
