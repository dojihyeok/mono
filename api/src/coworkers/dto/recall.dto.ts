import { IsString, MinLength } from 'class-validator';

// 동료 재호출 — 대상 동료 식별자
export class RecallDto {
  @IsString()
  @MinLength(1)
  coworkerId!: string;
}
