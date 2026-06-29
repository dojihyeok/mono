import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SettlementItemKind } from '@prisma/client';

// 정산 항목 1건 — 기본급/연장/수당/공제 등(nested create). PDF §7.
export class SettlementItemInput {
  @IsEnum(SettlementItemKind)
  kind!: SettlementItemKind;

  @IsInt()
  amount!: number; // 금액(원, 공제는 음수 가능)

  @IsOptional()
  @IsString()
  note?: string; // 제공/공제/부담 주체 등
}

// 정산 생성 — items nested create. status는 기본 DRAFT.
export class CreateSettlementDto {
  @IsString()
  @MinLength(1)
  workerId!: string; // 기술자(User)

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  workRequestId?: string;

  @IsString()
  @MinLength(1)
  period!: string; // 정산 기간(예: 2026-06)

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettlementItemInput)
  items!: SettlementItemInput[];
}
