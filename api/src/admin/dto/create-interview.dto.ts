import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

// BM 검증 CRM — 리드에 대한 인터뷰 일정/기록 생성
export class CreateInterviewDto {
  @IsString()
  @MinLength(1)
  leadId!: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
