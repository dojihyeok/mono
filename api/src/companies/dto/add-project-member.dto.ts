import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PartnerProjectMemberRole, PartnerProjectMemberStatus } from '@prisma/client';

// 프로젝트 인력 배정 — MONO 가입 기술자(userId) 또는 미가입 외부 인력(이름만) 등록.
export class AddProjectMemberDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsEnum(PartnerProjectMemberRole)
  role?: PartnerProjectMemberRole;

  @IsOptional()
  @IsEnum(PartnerProjectMemberStatus)
  status?: PartnerProjectMemberStatus;

  @IsOptional()
  @IsString()
  joinedAt?: string;
}
