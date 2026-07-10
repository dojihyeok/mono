import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AlertStatus } from '@prisma/client';

// /amono 관리자 운영·컴플라이언스(v1.0) — 운영 알림 상태 갱신
export class UpdateAlertDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;
}
