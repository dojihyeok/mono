import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CandidateStatus } from '@prisma/client';

// 후보 상태 변경 — SHORTLISTED/CONTACTED/SELECTED/REJECTED 등. 부분 갱신.
export class UpdateCandidateDto {
  @IsOptional()
  @IsEnum(CandidateStatus)
  status?: CandidateStatus;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  memo?: string;
}
