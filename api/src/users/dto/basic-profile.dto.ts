import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { CareerBand } from '@prisma/client';

// 기본 프로필: 직종(복수) + 경력구간(선택) + 희망지역(복수)
export class BasicProfileDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  jobType!: string[];

  // 경력구간 미선택 가능 — 미선택 시 직종/희망지역만 갱신(미설정 유지)
  @IsOptional()
  @IsEnum(CareerBand)
  careerYears?: CareerBand;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  region!: string[];
}
