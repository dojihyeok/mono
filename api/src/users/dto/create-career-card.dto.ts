import { IsOptional, IsString, MinLength } from 'class-validator';

// 경력 카드 등록 (DB: CareerCard)
export class CreateCareerCardDto {
  @IsString()
  @MinLength(1)
  siteName!: string; // 현장명 — 필수

  @IsOptional()
  @IsString()
  field?: string; // 작업 분야

  @IsOptional()
  @IsString()
  startDate?: string; // "YYYY-MM" 등 — 서비스에서 Date 변환

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  role?: string; // 역할

  @IsOptional()
  @IsString()
  equipment?: string; // 사용 장비

  @IsOptional()
  @IsString()
  coworkers?: string; // 함께 일한 사람(비공개)

  @IsOptional()
  @IsString()
  memo?: string; // 사적 메모(비공개)
}
