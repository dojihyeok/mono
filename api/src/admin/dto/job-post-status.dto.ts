import { IsEnum } from 'class-validator';
import { JobPostStatus } from '@prisma/client';

// 관리자 공고 상태 변경 (승인=OPEN / 마감=CLOSED / 승인대기=PENDING)
export class JobPostStatusDto {
  @IsEnum(JobPostStatus)
  status!: JobPostStatus;
}
