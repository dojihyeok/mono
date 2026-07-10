import { IsEnum } from 'class-validator';
import { SitePrepKind } from '@prisma/client';

// 현장 준비 서류 제출(Field Pass P0) — 자가신고. 관리자 승인/반려는 admin 쪽 DTO.
export class SubmitSitePrepDto {
  @IsEnum(SitePrepKind)
  kind!: SitePrepKind;
}
