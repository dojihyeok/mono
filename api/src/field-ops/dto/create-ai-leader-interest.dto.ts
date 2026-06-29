import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IndustryType } from '@prisma/client';

// AI현장리더 관심 등록 (DB: AiLeaderInterest) — 캐노니컬 §3-2(12). 익명 허용.
export class CreateAiLeaderInterestDto {
  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType;

  @IsOptional()
  @IsString()
  userId?: string;

  // 조건 — Json 컬럼에 그대로 저장
  @IsOptional()
  @IsObject()
  conditions?: Record<string, unknown>;

  // 반복 패턴 — Json 컬럼에 그대로 저장
  @IsOptional()
  @IsObject()
  repeatPattern?: Record<string, unknown>;

  // 팀 후보 매칭(느슨한 참조)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  candidateTeamIds?: string[];
}
