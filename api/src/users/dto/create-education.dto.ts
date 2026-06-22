import { IsOptional, IsString, MinLength } from 'class-validator';

// 교육 이력 등록 (DB: Education)
export class CreateEducationDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  institute?: string;

  @IsOptional()
  @IsString()
  completedAt?: string; // "YYYY-MM" 등 — 서비스에서 Date 변환
}
