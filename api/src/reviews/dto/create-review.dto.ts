import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { RateeType } from '@prisma/client';

// 다방향 평가 제출 — 캐노니컬 §3-2(9)/§6. 7항목 점수(0~5, 선택) + 코멘트.
export class CreateReviewDto {
  @IsString()
  @MinLength(1)
  raterUserId!: string;

  @IsEnum(RateeType)
  rateeType!: RateeType;

  @IsString()
  @MinLength(1)
  rateeId!: string; // SITE_ENVIRONMENT 는 workRequestId 의미로 사용

  @IsOptional()
  @IsString()
  workRequestId?: string;

  @IsOptional() @IsInt() @Min(0) @Max(5) scheduleAdherence?: number; // 일정준수
  @IsOptional() @IsInt() @Min(0) @Max(5) workQuality?: number; // 작업품질
  @IsOptional() @IsInt() @Min(0) @Max(5) communication?: number; // 커뮤니케이션
  @IsOptional() @IsInt() @Min(0) @Max(5) safetyManagement?: number; // 안전관리
  @IsOptional() @IsInt() @Min(0) @Max(5) costTrust?: number; // 비용신뢰
  @IsOptional() @IsInt() @Min(0) @Max(5) rehireIntent?: number; // 재의뢰의향
  @IsOptional() @IsInt() @Min(0) @Max(5) siteEnvironment?: number; // 현장환경만족도
  @IsOptional() @IsInt() @Min(0) @Max(5) collaboration?: number; // 협업 태도(외국인 §5-1)

  @IsOptional()
  @IsString()
  comment?: string;
}
