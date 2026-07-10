import { IsDateString, IsOptional, IsString } from 'class-validator';

// BM 검증 CRM — 인터뷰 완료 처리·메모·후속액션 갱신
export class UpdateInterviewDto {
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  followUpAction?: string;
}
