import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

// 장비 이력 등록 — 캐노니컬 §3-2(2). name 필수, 나머지 선택.
export class CreateEquipmentHistoryDto {
  @IsString()
  @MinLength(1)
  name!: string; // 장비/공구명

  @IsOptional()
  @IsString()
  category?: string; // 분류

  @IsOptional()
  @IsBoolean()
  proficient?: boolean; // 운용 가능

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsUsed?: number;

  @IsOptional()
  @IsString()
  memo?: string;
}
