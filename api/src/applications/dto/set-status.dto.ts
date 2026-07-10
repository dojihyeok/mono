import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

// 기업의 지원 상태 변경 — APPLIED → REVIEWING/CONTACT_PENDING → ACCEPTED/REJECTED
export class SetStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}
