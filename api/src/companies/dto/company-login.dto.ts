import { IsString, MinLength } from 'class-validator';

// 기업 로그인 — 신청 시 입력한 연락처로 기존 협약 조회(데모: 비번 없음)
export class CompanyLoginDto {
  @IsString()
  @MinLength(1)
  contactPhone!: string;
}
