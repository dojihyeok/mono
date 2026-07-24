import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PartnerProjectMemberRole, PartnerProjectMemberStatus } from '@prisma/client';

export class UpdateProjectMemberDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

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

  @IsOptional()
  @IsString()
  leftAt?: string;
}
