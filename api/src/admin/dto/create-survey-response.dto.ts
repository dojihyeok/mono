import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

// BM 검증 CRM — 이해관계자별 설문 응답 기록(외부 설문 결과를 관리자가 옮겨 적음)
export class CreateSurveyResponseDto {
  @IsOptional()
  @IsString()
  leadId?: string;

  @IsString()
  @MinLength(1)
  role!: string; // bm/page.tsx SURVEY_ROLES 키

  @IsArray()
  answers!: { topic: string; question: string; answer: string }[];
}
