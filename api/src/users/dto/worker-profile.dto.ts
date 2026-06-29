import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  IndustryType,
  KoreanLevel,
  Residency,
  SupportedLang,
} from '@prisma/client';

// 기술자 확장 프로필 — 캐노니컬 §3-2(1) + 외국인 속성(dev-plan-foreign-workforce §2·§5·§8-1).
// 모든 필드 선택(부분 갱신 upsert).
export class WorkerProfileDto {
  // 산업분야(복수)
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[];

  // 희망 작업유형
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredWorkTypes?: string[];

  // 유사작업경험 태그(매칭용)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  similarWorkExperience?: string[];

  // 연락 가능 시간
  @IsOptional()
  @IsString()
  contactHours?: string;

  // 자기소개
  @IsOptional()
  @IsString()
  introduction?: string;

  // ── 외국인 기술자 속성 ──
  // 국내 체류 / 해외 거주
  @IsOptional()
  @IsEnum(Residency)
  residency?: Residency;

  // 국적
  @IsOptional()
  @IsString()
  nationality?: string;

  // 구사 언어(복수)
  @IsOptional()
  @IsArray()
  @IsEnum(SupportedLang, { each: true })
  languages?: SupportedLang[];

  // 한국어 수준
  @IsOptional()
  @IsEnum(KoreanLevel)
  koreanLevel?: KoreanLevel;

  // 통역 필요 여부
  @IsOptional()
  @IsBoolean()
  interpreterNeeded?: boolean;

  // 현장 용어 이해도(0~100)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  glossaryComprehension?: number;

  // 한국 취업 희망 시점(해외 예비)
  @IsOptional()
  @IsDateString()
  desiredEntryDate?: string;
}
