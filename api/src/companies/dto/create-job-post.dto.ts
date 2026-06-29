import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { CareerBand } from '@prisma/client';

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
}
