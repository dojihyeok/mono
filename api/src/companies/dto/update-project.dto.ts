import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { IndustryType, PartnerProjectStatus } from '@prisma/client';

// Partner Workspace 프로젝트 수정
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  region?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  requiredHeadcount?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(PartnerProjectStatus)
  status?: PartnerProjectStatus;

  @IsOptional()
  @IsString()
  memo?: string;
}
