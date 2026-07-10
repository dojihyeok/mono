import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

// BM 검증(v1.2) — 다음 실행 액션 상태·내용 갱신
export class UpdateBmNextActionDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  hypothesisId?: string;

  @IsOptional()
  @IsString()
  successCriteria?: string;

  @IsOptional()
  @IsString()
  blocker?: string;

  @IsOptional()
  @IsIn(['OPEN', 'DONE', 'BLOCKED'])
  status?: string;
}
