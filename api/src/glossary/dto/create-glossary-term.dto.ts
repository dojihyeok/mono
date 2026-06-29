import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IndustryType, SupportedLang } from '@prisma/client';

// 용어 번역 1건 — 언어 + 번역문(nested create).
export class GlossaryTranslationInput {
  @IsEnum(SupportedLang)
  lang!: SupportedLang;

  @IsString()
  @MinLength(1)
  text!: string;
}

// 현장 용어 생성(관리자 시드용) — translations 동시 생성. PDF §4.
export class CreateGlossaryTermDto {
  @IsString()
  @MinLength(1)
  koTerm!: string; // 한국어 현장 표현

  @IsString()
  @MinLength(1)
  category!: string; // 작업지시 / 안전문구 / 장비·공구 / 자재

  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType; // 산업별 용어팩(없으면 공통)

  @IsOptional()
  @IsString()
  iconUrl?: string; // 이미지·아이콘 안내

  @IsOptional()
  @IsBoolean()
  isSafety?: boolean; // 안전문구 여부

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GlossaryTranslationInput)
  translations?: GlossaryTranslationInput[];
}
