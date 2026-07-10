import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { CareerBand, JobSiteType } from '@prisma/client';

// 채용 공고 선등록 (DB: JobPost, 초기 status PENDING=승인 대기)
export class CreateJobPostDto {
  @IsString()
  @MinLength(1)
  title!: string; // 공고 제목

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  jobType!: string[]; // 필요 직군(복수)

  @IsOptional()
  @IsInt()
  @Min(1)
  headcount?: number; // 인원

  @IsOptional()
  @IsEnum(CareerBand)
  careerBand?: CareerBand; // 필요 최소 경력(버킷)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certs?: string[]; // 필요 자격(자유 입력)

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  region!: string[]; // 현장 지역(복수)

  @IsOptional()
  @IsString()
  period?: string; // 근무 기간

  @IsOptional()
  @IsString()
  conditions?: string; // 근무 조건

  // ── BM 검증(P0-1) — 급구 공고 과금 대상 ──
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean; // 급구 공고(상단 노출 과금 대상)

  @IsOptional()
  @IsEnum(JobSiteType)
  siteType?: JobSiteType; // 오늘 현장 / 대형 현장
}
