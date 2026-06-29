import { IsEnum } from 'class-validator';
import { WorkRequestStatus } from '@prisma/client';

// 작업요청 상태 변경 (admin) — DRAFT→OPEN→MATCHING→ASSIGNED→COMPLETED→CLOSED/CANCELLED
export class WorkRequestStatusDto {
  @IsEnum(WorkRequestStatus)
  status!: WorkRequestStatus;
}
