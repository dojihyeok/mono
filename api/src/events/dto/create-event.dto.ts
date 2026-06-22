import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

// 마케팅 분석용 이벤트 로그 (예: signup_completed, career_added)
export class CreateEventDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  props?: Record<string, unknown>;
}
