import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IndustryType, SupportedLang } from '@prisma/client';

// 현장 용어 목록/용어팩 필터 — 쿼리스트링(@Query). 전역 ValidationPipe로 검증.
export class QueryGlossaryDto {
  @IsOptional()
  @IsEnum(SupportedLang)
  lang?: SupportedLang; // 주어지면 해당 언어 번역만 include

  @IsOptional()
  @IsString()
  category?: string; // 작업지시 / 안전문구 / 장비·공구 / 자재

  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType; // 산업별 용어 필터
}
