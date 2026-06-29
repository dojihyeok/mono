import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CareerBand, IndustryType } from '@prisma/client';

// 팀원 1명 — 반장이 입력(이름 + 연락처). 연락처로 멱등 가입.
export class TeamMemberInput {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  phone!: string; // 식별자(멱등 가입 키)
}

// 반장이 팀을 통째로 등록 — 팀명 + 멤버 목록 + 팀 프로필(선택, 캐노니컬 §3-3)
export class RegisterTeamDto {
  @IsString()
  @MinLength(1)
  name!: string; // 팀명

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberInput)
  members?: TeamMemberInput[];

  // ── 팀 프로필(선택) — 있을 때만 Team에 반영 ──
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[]; // 산업분야(복수)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workTypes?: string[]; // 작업유형

  @IsOptional()
  @IsEnum(CareerBand)
  avgCareerBand?: CareerBand; // 평균 경력(버킷)

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  safetyRate?: number; // 안전이수율(0~1)

  @IsOptional()
  @IsInt()
  @Min(0)
  equipOperators?: number; // 장비운용 인력 수

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[]; // 투입 가능 지역
}
