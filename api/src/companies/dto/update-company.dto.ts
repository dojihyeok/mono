import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { CompanyKind, IndustryType } from '@prisma/client';

// 기업 정보 수정 (신뢰 프로필: 파트너 유형·산업분야·안전이수율·재의뢰율·메모)
export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  contactName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  region?: string[];

  // 수행기업/운영자 구분
  @IsOptional()
  @IsEnum(CompanyKind)
  companyKind?: CompanyKind;

  // 산업분야(복수)
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[];

  // 안전이수율(0~1)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  safetyRate?: number;

  // 재의뢰율(0~1)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  rehireRate?: number;

  @IsOptional()
  @IsString()
  defectMemo?: string;

  @IsOptional()
  @IsString()
  memo?: string;
}
