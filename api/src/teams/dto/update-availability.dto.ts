import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TeamAvailabilityStatus } from '@prisma/client';

// 반장 팀의 주간 가동일정 upsert — weekStart(YYYY-MM-DD) 기준 멱등 갱신. (캐노니컬 §3-2(4))
export class UpdateAvailabilityDto {
  @IsString()
  @MinLength(1)
  weekStart!: string; // 주 시작일 YYYY-MM-DD (upsert 키)

  @IsOptional()
  @IsEnum(TeamAvailabilityStatus)
  status?: TeamAvailabilityStatus; // 미지정 시 기본 AVAILABLE

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[]; // 이동 가능 지역

  @IsOptional()
  @IsBoolean()
  urgentOk?: boolean; // 긴급투입 가능
}
