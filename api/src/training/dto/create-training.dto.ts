import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TrainingKind } from '@prisma/client';

// 교육 이수 기록 생성 — 안전/직무/한국어. PDF §6-2.
export class CreateTrainingDto {
  @IsEnum(TrainingKind)
  kind!: TrainingKind; // SAFETY / JOB / KOREAN

  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  provider?: string; // 교육기관

  @IsOptional()
  @IsDateString()
  completedAt?: string; // 이수일(ISO)

  @IsOptional()
  @IsString()
  certUrl?: string; // 수료증
}
