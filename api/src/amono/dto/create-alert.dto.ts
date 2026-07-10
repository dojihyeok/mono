import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { AlertStatus } from '@prisma/client';

// /amono 관리자 운영·컴플라이언스(v1.0) — 운영 알림 신규 등록
export class CreateAlertDto {
  @IsString()
  @MinLength(1)
  type!: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;
}
