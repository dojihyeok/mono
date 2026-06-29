import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IndustryType } from '@prisma/client';

// 작업수행사례 등록 (DB: WorkRecord) — 캐노니컬 §3-2(6). 수행기업 소유.
export class CreateWorkRecordDto {
  @IsEnum(IndustryType)
  industry!: IndustryType;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workTypes?: string[];

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsString()
  scaleMemo?: string; // 규모

  @IsOptional()
  @IsString()
  description?: string;
}
