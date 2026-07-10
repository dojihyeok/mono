import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { FieldPassEventResult } from '@prisma/client';

// /amono 관리자 운영·컴플라이언스(v1.0) — Field Pass 인증 이벤트 신규 기록
export class CreateFieldPassEventDto {
  @IsString()
  @MinLength(1)
  siteId!: string;

  @IsOptional()
  @IsString()
  gateName?: string;

  @IsString()
  @MinLength(1)
  authMethod!: string;

  @IsEnum(FieldPassEventResult)
  result!: FieldPassEventResult;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}
