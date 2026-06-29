import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { VisaType, VisaDocStatus } from '@prisma/client';

// 체류·비자 상태 등록 — dev-plan-foreign-workforce §6. visaType 필수, 나머지 선택.
export class VisaStatusDto {
  @IsEnum(VisaType)
  visaType!: VisaType;

  // 만료일
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  // 갱신 예정일
  @IsOptional()
  @IsDateString()
  renewalDueDate?: string;

  // 근무 가능 범위(업종·직무·사업장 제한)
  @IsOptional()
  @IsString()
  workScope?: string;

  // 사업장 변경 가능 여부
  @IsOptional()
  @IsBoolean()
  workplaceChangeable?: boolean;

  // 외국인등록증 번호(민감 — 마스킹 노출)
  @IsOptional()
  @IsString()
  arcNumber?: string;

  @IsOptional()
  @IsEnum(VisaDocStatus)
  status?: VisaDocStatus;
}
