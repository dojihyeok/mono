import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

// 기업의 지원 수락/반려
export class SetStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus; // ACCEPTED | REJECTED (| APPLIED)
}
