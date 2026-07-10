import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

// BM 검증(v1.2) — 다음 실행 액션 신규 등록
export class CreateBmNextActionDto {
  @IsString()
  @MinLength(1)
  action!: string;

  @IsString()
  @MinLength(1)
  owner!: string;

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
