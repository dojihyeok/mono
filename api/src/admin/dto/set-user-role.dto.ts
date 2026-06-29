import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

// 반장(현장리더) 승인/해제 — role 을 WORKER/FIELD_LEADER 로 설정
export class SetUserRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
