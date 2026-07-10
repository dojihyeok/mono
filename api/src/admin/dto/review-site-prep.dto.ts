import { IsIn, IsOptional, IsString } from 'class-validator';

// 관리자 현장 준비 서류 승인/반려 — status는 VERIFIED|REJECTED만 허용(SUBMITTED로 되돌리는 것은 사용자 재제출 경로).
export class ReviewSitePrepDto {
  @IsIn(['VERIFIED', 'REJECTED'])
  status!: 'VERIFIED' | 'REJECTED';

  @IsOptional()
  @IsString()
  memo?: string;
}
